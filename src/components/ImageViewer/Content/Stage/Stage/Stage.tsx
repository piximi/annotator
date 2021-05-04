import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import Konva from "konva";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ToolType } from "../../../../../types/ToolType";
import {
  annotatingSelector,
  imageInstancesSelector,
  invertModeSelector,
  selectedCategorySelector,
  selectionModeSelector,
  stageHeightSelector,
  stageScaleSelector,
  stageWidthSelector,
  toolTypeSelector,
  zoomSelectionSelector,
} from "../../../../../store/selectors";
import {
  applicationSlice,
  setSelectedAnnotation,
  setSelectedAnnotations,
} from "../../../../../store";
import {
  Provider,
  ReactReduxContext,
  useDispatch,
  useSelector,
} from "react-redux";
import { useAnnotationTool, useHandTool, useZoom } from "../../../../../hooks";
import { AnnotationType } from "../../../../../types/AnnotationType";
import { penSelectionBrushSizeSelector } from "../../../../../store/selectors/penSelectionBrushSizeSelector";
import { AnnotationModeType } from "../../../../../types/AnnotationModeType";
import { Image } from "../Image";
import { Selecting } from "../Selecting";
import { annotatedSelector } from "../../../../../store/selectors/annotatedSelector";
import {
  ColorAnnotationTool,
  ObjectAnnotationTool,
  Tool,
} from "../../../../../image/Tool";
import { ColorAnnotationToolTip } from "../ColorAnnotationToolTip";
import useSound from "use-sound";
import createAnnotationSoundEffect from "../../../../../sounds/pop-up-on.mp3";
import deleteAnnotationSoundEffect from "../../../../../sounds/pop-up-off.mp3";
import { soundEnabledSelector } from "../../../../../store/selectors/soundEnabledSelector";
import { Layer } from "../Layer";
import { ZoomSelection } from "../Selection/ZoomSelection";
import { useKeyboardShortcuts } from "../../../../../hooks/useKeyboardShortcuts";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";
import { selectedAnnotationsIdsSelector } from "../../../../../store/selectors/selectedAnnotationsIdsSelector";
import { Transformers } from "../Transformers/Transformers";
import {
  useAltPress,
  useShiftPress,
} from "../../../../../hooks/useKeyPress/useKeyPress";
import { useWindowFocusHandler } from "../../../../../hooks/useWindowFocusHandler/useWindowFocusHandler";
import { stagePositionSelector } from "../../../../../store/selectors/stagePositionSelector";
import { KonvaEventObject } from "konva/types/Node";
import { scaledImageWidthSelector } from "../../../../../store/selectors/scaledImageWidthSelector";
import { scaledImageHeightSelector } from "../../../../../store/selectors/scaledImageHeightSelector";
import { PenAnnotationToolTip } from "../PenAnnotationToolTip/PenAnnotationToolTip";
import { selectedAnnotationsSelector } from "../../../../../store/selectors/selectedAnnotationsSelector";
import { scaledSelectedAnnotationContourSelector } from "../../../../../store/selectors/scaledSelectedAnnotationContourSelector";
import { Annotations } from "../Annotations/Annotations";
import { unselectedAnnotationsSelector } from "../../../../../store/selectors/unselectedAnnotationsSelector";
import {
  computeBoundingBoxFromContours,
  invertContour,
  invertMask,
} from "../../../../../image/imageHelper";
import { imageWidthSelector } from "../../../../../store/selectors/imageWidthSelector";
import { imageHeightSelector } from "../../../../../store/selectors/imageHeightSelector";
import { quickSelectionBrushSizeSelector } from "../../../../../store/selectors/quickSelectionBrushSizeSelector";
import { useHotkeys } from "react-hotkeys-hook";

export const Stage = () => {
  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const selectingRef = useRef<Konva.Line | null>(null);

  const toolType = useSelector(toolTypeSelector);

  const invertMode = useSelector(invertModeSelector);
  const penSelectionBrushSize = useSelector(penSelectionBrushSizeSelector);
  const selectedAnnotationsIds = useSelector(selectedAnnotationsIdsSelector);
  const quickSelectionBrushSize = useSelector(quickSelectionBrushSizeSelector);
  const selectedCategory = useSelector(selectedCategorySelector);

  const selectedAnnotations = useSelector(selectedAnnotationsSelector);
  const unselectedAnnotations = useSelector(unselectedAnnotationsSelector);
  const selectionMode = useSelector(selectionModeSelector);

  const stageHeight = useSelector(stageHeightSelector);
  const stageWidth = useSelector(stageWidthSelector);
  const stagePosition = useSelector(stagePositionSelector);

  const scaledImageWidth = useSelector(scaledImageWidthSelector);
  const scaledImageHeight = useSelector(scaledImageHeightSelector);

  const imageWidth = useSelector(imageWidthSelector);
  const imageHeight = useSelector(imageHeightSelector);

  const stageScale = useSelector(stageScaleSelector);

  const dispatch = useDispatch();

  const {
    deselect: onZoomDeselect,
    onMouseUp: onZoomMouseUp,
    onMouseMove: onZoomMouseMove,
    onMouseDown: onZoomMouseDown,
    onWheel: onZoomWheel,
  } = useZoom();

  const [annotationTool] = useAnnotationTool();

  const [, update] = useReducer((x) => x + 1, 0);

  const annotations = useSelector(imageInstancesSelector);

  const annotated = useSelector(annotatedSelector);
  const annotating = useSelector(annotatingSelector);

  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  const scaledContour = useSelector(scaledSelectedAnnotationContourSelector);
  const { dragging: zoomDragging, selecting: zoomSelecting } = useSelector(
    zoomSelectionSelector
  );

  useShiftPress();
  useAltPress();
  useWindowFocusHandler();

  const [playCreateAnnotationSoundEffect] = useSound(
    createAnnotationSoundEffect
  );
  const [playDeleteAnnotationSoundEffect] = useSound(
    deleteAnnotationSoundEffect
  );

  const soundEnabled = useSelector(soundEnabledSelector);

  const detachTransformer = (transformerId: string) => {
    if (!stageRef || !stageRef.current) return;
    const transformer = stageRef.current.findOne(`#${transformerId}`);

    if (!transformer) return;

    (transformer as Konva.Transformer).detach();
    (transformer as Konva.Transformer).getLayer()?.batchDraw();
  };

  const deselectAllTransformers = () => {
    if (!stageRef || !stageRef.current) return;

    const transformers = stageRef.current.find("Transformer").toArray();
    transformers.forEach((tr: any) => {
      (tr as Konva.Transformer).detach();
      (tr as Konva.Transformer).getLayer()?.batchDraw();
    });
  };

  const deselectAllAnnotations = () => {
    dispatch(setSelectedAnnotations({ selectedAnnotations: [] }));
    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: undefined,
      })
    );
  };

  const deselectAnnotation = () => {
    if (!annotationTool) return;

    annotationTool.deselect();

    if (!selectedAnnotation) return;

    selectingRef.current = null;

    const transformerId = "tr-".concat(selectedAnnotation.id);
    detachTransformer(transformerId);
  };

  useEffect(() => {
    if (!annotationTool) return;

    if (
      !selectedAnnotation ||
      !selectedAnnotation.mask ||
      !selectedAnnotation.contour
    )
      return;

    const invertedMask = invertMask(selectedAnnotation.mask, true);

    if (!imageWidth || !imageHeight) return;

    const invertedContour = invertContour(
      selectedAnnotation.contour,
      imageWidth,
      imageHeight
    );

    const invertedBoundingBox = computeBoundingBoxFromContours(invertedContour);

    dispatch(
      setSelectedAnnotations({
        selectedAnnotations: [
          {
            ...selectedAnnotation,
            boundingBox: invertedBoundingBox,
            contour: invertedContour,
            mask: invertedMask,
          },
        ],
      })
    );
  }, [invertMode]);

  useEffect(() => {
    if (toolType === ToolType.Zoom) return;

    if (selectionMode === AnnotationModeType.New) return;

    if (!annotated || !annotationTool) return;

    dispatch(applicationSlice.actions.setAnnotating({ annotating: false }));

    if (!annotationTool.annotated) return;

    let combinedMask, combinedContour;

    if (!selectedAnnotation) return;

    if (selectionMode === AnnotationModeType.Add) {
      [combinedMask, combinedContour] = annotationTool.add(
        selectedAnnotation.mask
      );
    } else if (selectionMode === AnnotationModeType.Subtract) {
      [combinedMask, combinedContour] = annotationTool.subtract(
        selectedAnnotation.mask
      );
    } else if (selectionMode === AnnotationModeType.Intersect) {
      [combinedMask, combinedContour] = annotationTool.intersect(
        selectedAnnotation.mask
      );
    }

    annotationTool.mask = combinedMask;
    annotationTool.contour = combinedContour;

    if (!combinedContour) return;
    annotationTool.boundingBox = annotationTool.computeBoundingBoxFromContours(
      combinedContour
    );

    if (
      !annotationTool.boundingBox ||
      !annotationTool.contour ||
      !annotationTool.mask
    )
      return;

    dispatch(
      setSelectedAnnotations({
        selectedAnnotations: [
          {
            ...selectedAnnotation,
            boundingBox: annotationTool.boundingBox,
            contour: annotationTool.contour,
            mask: annotationTool.mask,
          },
        ],
      })
    );

    dispatch(
      setSelectedAnnotation({
        selectedAnnotation: {
          ...selectedAnnotation,
          boundingBox: annotationTool.boundingBox,
          contour: annotationTool.contour,
          mask: annotationTool.mask,
        },
      })
    );
  }, [annotated]);

  useEffect(() => {
    if (!selectedAnnotationsIds) return;

    if (!annotations) return;

    const updatedAnnotations = _.map(
      selectedAnnotations,
      (annotation: AnnotationType) => {
        return { ...annotation, categoryId: selectedCategory.id };
      }
    );

    dispatch(
      applicationSlice.actions.setSelectedAnnotations({
        selectedAnnotations: updatedAnnotations,
      })
    );
    if (!selectedAnnotation) return;

    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: {
          ...selectedAnnotation,
          categoryId: selectedCategory.id,
        },
      })
    );
  }, [selectedCategory]);

  useEffect(() => {
    if (!annotationTool) return;

    if (annotationTool.annotated) {
      dispatch(
        applicationSlice.actions.setAnnotated({
          annotated: annotationTool.annotated,
        })
      );

      if (selectionMode !== AnnotationModeType.New) return;
      annotationTool.annotate(selectedCategory);
    }

    if (selectionMode === AnnotationModeType.New) return;

    if (annotationTool.annotating)
      dispatch(
        applicationSlice.actions.setAnnotating({
          annotating: annotationTool.annotating,
        })
      );
  }, [annotationTool?.annotated, annotationTool?.annotating]);

  useEffect(() => {
    if (toolType === ToolType.PenAnnotation) {
      // @ts-ignore
      annotationTool.brushSize = penSelectionBrushSize / stageScale;
    }
  }, [penSelectionBrushSize]);

  useEffect(() => {
    if (toolType === ToolType.QuickAnnotation) {
      //@ts-ignore
      annotationTool.update(Math.round(quickSelectionBrushSize / stageScale));
    }
  }, [quickSelectionBrushSize]);

  useEffect(() => {
    if (!annotated) return;

    if (!annotationTool || !annotationTool.contour) return;

    if (!annotationTool) return;

    annotationTool.annotate(selectedCategory);

    if (!annotationTool.annotation) return;

    if (selectionMode !== AnnotationModeType.New) return;

    dispatch(
      setSelectedAnnotation({
        selectedAnnotation: annotationTool.annotation,
      })
    );

    dispatch(
      setSelectedAnnotations({
        selectedAnnotations: [annotationTool.annotation],
      })
    );
  }, [annotated]);

  useEffect(() => {
    if (!stageRef || !stageRef.current) return;

    _.forEach(selectedAnnotationsIds, (annotationId) => {
      if (!stageRef || !stageRef.current) return;

      const transformerId = "tr-".concat(annotationId);

      const transformer = stageRef.current.findOne(`#${transformerId}`);
      const line = stageRef.current.findOne(`#${annotationId}`);

      if (!line) return;

      if (!transformer) return;

      (transformer as Konva.Transformer).nodes([line]);

      const layer = (transformer as Konva.Transformer).getLayer();

      if (!layer) return;

      layer.batchDraw();
    });
  }, [selectedAnnotationsIds, selectedAnnotation?.contour]);

  const getRelativePointerPosition = (position: { x: number; y: number }) => {
    if (!imageRef || !imageRef.current) return;

    const transform = imageRef.current.getAbsoluteTransform().copy();

    transform.invert();

    return transform.point(position);
  };

  const onMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    if (
      !event.target.getParent() ||
      event.target.getParent().className === "Transformer"
    )
      return;
    memoizedOnMouseDown();
  };

  const memoizedOnMouseDown = useMemo(() => {
    const func = () => {
      if (toolType === ToolType.Hand) return;

      if (!stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      if (!relative) return;

      if (toolType === ToolType.Pointer) {
        dispatch(
          applicationSlice.actions.setCurrentPosition({
            currentPosition: relative,
          })
        );
        return;
      }

      const rawImagePosition = {
        x: relative.x / stageScale,
        y: relative.y / stageScale,
      };

      if (toolType === ToolType.Zoom) {
        onZoomMouseDown(relative);
      } else {
        if (annotated) {
          deselectAnnotation();
          dispatch(applicationSlice.actions.setAnnotated({ annotated: false }));
        }

        if (selectionMode === AnnotationModeType.New) {
          dispatch(
            applicationSlice.actions.setSelectedAnnotation({
              selectedAnnotation: undefined,
            })
          );
          dispatch(
            applicationSlice.actions.setSelectedAnnotations({
              selectedAnnotations: [],
            })
          );
        }

        if (!annotationTool) return;

        annotationTool.onMouseDown(rawImagePosition);

        update();
      }
    };
    const throttled = _.throttle(func, 5);
    return () => throttled();
  }, [
    annotated,
    annotationTool,
    selectionMode,
    toolType,
    zoomDragging,
    zoomSelecting,
  ]);

  const onMouseMove = useMemo(() => {
    const func = () => {
      if (!stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      if (!relative || !scaledImageWidth || !scaledImageHeight) return;

      if (toolType === ToolType.PenAnnotation)
        dispatch(
          applicationSlice.actions.setCurrentPosition({
            currentPosition: relative,
          })
        );

      if (
        relative.x > scaledImageWidth ||
        relative.y > scaledImageHeight ||
        relative.x < 0 ||
        relative.y < 0
      )
        return;

      const rawImagePosition = {
        x: relative.x / stageScale,
        y: relative.y / stageScale,
      };

      if (toolType === ToolType.Zoom) {
        onZoomMouseMove(relative);
      } else {
        if (!annotationTool) return;

        annotationTool.onMouseMove(rawImagePosition);

        update();
      }
    };
    const throttled = _.throttle(func, 5);
    return () => throttled();
  }, [annotationTool, toolType, zoomDragging, zoomSelecting]);

  const onMouseUp = useMemo(() => {
    const func = async () => {
      if (!stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      if (!relative) return;

      const rawImagePosition = {
        x: relative.x / stageScale,
        y: relative.y / stageScale,
      };

      if (toolType === ToolType.Zoom) {
        onZoomMouseUp(relative);
      } else {
        if (!annotationTool) return;

        if (!relative || !scaledImageWidth || !scaledImageHeight) return;

        if (toolType === ToolType.ObjectAnnotation) {
          await (annotationTool as ObjectAnnotationTool).onMouseUp(
            rawImagePosition
          );
        }
        annotationTool.onMouseUp(rawImagePosition);

        update();
      }
    };
    const throttled = _.throttle(func, 10);

    return () => throttled();
  }, [annotationTool, toolType, zoomDragging, zoomSelecting]);

  useHotkeys(
    "enter",
    () => {
      if (!annotations || !annotationTool || annotationTool.annotating) return;

      dispatch(
        applicationSlice.actions.setImageInstances({
          instances: [...unselectedAnnotations, ...selectedAnnotations],
        })
      );

      if (soundEnabled) playCreateAnnotationSoundEffect();

      deselectAnnotation();

      dispatch(applicationSlice.actions.setAnnotated({ annotated: false }));

      if (selectionMode !== AnnotationModeType.New)
        dispatch(
          applicationSlice.actions.setSelectionMode({
            selectionMode: AnnotationModeType.New,
          })
        );

      if (!selectedAnnotationsIds.length) return;

      deselectAllAnnotations();
      deselectAllTransformers();
    },
    [
      annotations,
      annotationTool,
      annotationTool?.annotating,
      dispatch,
      selectedAnnotations,
      unselectedAnnotations,
      selectionMode,
      selectedAnnotationsIds,
    ]
  );

  useHotkeys(
    "enter",
    () => {
      if (
        toolType !== ToolType.PolygonalAnnotation &&
        toolType !== ToolType.LassoAnnotation
      )
        return;

      if (!annotationTool) return;

      annotationTool.connect();
    },
    [toolType, annotationTool]
  );

  useHotkeys(
    "backspace, delete",
    () => {
      _.map(selectedAnnotationsIds, (annotationId: string) => {
        dispatch(
          applicationSlice.actions.deleteImageInstance({
            id: annotationId,
          })
        );
      });
      deselectAllAnnotations();
      deselectAllTransformers();

      if (!_.isEmpty(annotations) && soundEnabled) {
        playDeleteAnnotationSoundEffect();
      }

      deselectAnnotation();
    },
    [selectedAnnotationsIds, annotations]
  );

  useHotkeys(
    "escape",
    () => {
      deselectAllAnnotations();
      deselectAllTransformers();

      if (!_.isEmpty(annotations) && soundEnabled) {
        playDeleteAnnotationSoundEffect();
      }

      deselectAnnotation();

      if (toolType !== ToolType.Zoom) return;
      onZoomDeselect();
    },
    [annotations]
  );

  /*/
  Detach transformers and selections when all annotations are removed
   */
  useEffect(() => {
    if (!annotations) return;

    if (annotations.length) return;

    deselectAllTransformers();
    deselectAllAnnotations();
  }, [annotations?.length]);

  const [tool, setTool] = useState<Tool>();

  useEffect(() => {
    setTool(annotationTool);
  }, [annotationTool, toolType]);

  useKeyboardShortcuts();

  const { draggable } = useHandTool();

  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        <ReactKonva.Stage
          draggable={draggable}
          height={stageHeight}
          onMouseDown={(evt) => onMouseDown(evt)}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onWheel={onZoomWheel}
          position={stagePosition}
          ref={stageRef}
          width={stageWidth}
        >
          <Provider store={store}>
            <Layer>
              <Image ref={imageRef} />

              <ZoomSelection />

              <Selecting tool={tool!} />

              <PenAnnotationToolTip annotationTool={annotationTool} />

              <Annotations />

              <Transformers transformPosition={getRelativePointerPosition} />

              <ColorAnnotationToolTip
                colorAnnotationTool={annotationTool as ColorAnnotationTool}
              />
            </Layer>
          </Provider>
        </ReactKonva.Stage>
      )}
    </ReactReduxContext.Consumer>
  );
};
