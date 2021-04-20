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
  setSelectedAnnotationsIds,
} from "../../../../../store";
import {
  Provider,
  ReactReduxContext,
  useDispatch,
  useSelector,
} from "react-redux";
import { useKeyPress } from "../../../../../hooks/useKeyPress";
import { useAnnotationTool, useHandTool, useZoom } from "../../../../../hooks";
import {
  AnnotationType,
  AnnotationType as SelectionType,
} from "../../../../../types/AnnotationType";
import { penSelectionBrushSizeSelector } from "../../../../../store/selectors/penSelectionBrushSizeSelector";
import { AnnotationModeType } from "../../../../../types/AnnotationModeType";
import { SelectedContour } from "../SelectedContour";
import { Image } from "../Image";
import { Annotations } from "../Annotations";
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

export const Stage = () => {
  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const transformerRef = useRef<Konva.Transformer | null>(null);
  const selectingRef = useRef<Konva.Line | null>(null);

  const toolType = useSelector(toolTypeSelector);

  const invertMode = useSelector(invertModeSelector);
  const penSelectionBrushSize = useSelector(penSelectionBrushSizeSelector);
  const selectedAnnotationsIds = useSelector(selectedAnnotationsIdsSelector);
  const selectedCategory = useSelector(selectedCategorySelector);
  const selectionMode = useSelector(selectionModeSelector);

  const stageHeight = useSelector(stageHeightSelector);
  const stageWidth = useSelector(stageWidthSelector);

  const [aspectRatio, setAspectRatio] = useState<number>(1);

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

  const [currentPosition, setCurrentPosition] = useState<{
    x: number;
    y: number;
  } | null>();

  const [, update] = useReducer((x) => x + 1, 0);

  const annotations = useSelector(imageInstancesSelector);

  const annotated = useSelector(annotatedSelector);
  const annotating = useSelector(annotatingSelector);

  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  const { dragging: zoomDragging, selecting: zoomSelecting } = useSelector(
    zoomSelectionSelector
  );

  const backspacePress = useKeyPress("Backspace");
  const deletePress = useKeyPress("Delete");
  const enterPress = useKeyPress("Enter");
  const escapePress = useKeyPress("Escape");
  const shiftPress = useKeyPress("Shift");

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

  const deselectAllAnnotations = () => {
    _.map(selectedAnnotationsIds, (annotationId: string) => {
      dispatch(setSelectedAnnotationsIds({ selectedAnnotationsIds: [] }));
      const transformerId = "tr-".concat(annotationId);
      detachTransformer(transformerId);
    });
  };

  const deselectAnnotation = () => {
    if (!annotationTool) return;

    annotationTool.deselect();

    transformerRef.current?.detach();
    transformerRef.current?.getLayer()?.batchDraw();

    selectingRef.current = null;
  };

  useEffect(() => {
    if (!selectedAnnotation || !selectedAnnotation.id || !annotationTool)
      return;

    if (!annotations) return;

    const selectedInstance: SelectionType = annotations.filter(
      (instance: SelectionType) => {
        return instance.id === selectedAnnotation.id;
      }
    )[0];

    if (
      !selectedInstance ||
      !selectedInstance.mask ||
      !selectedInstance.contour
    )
      return;

    const invertedMask = annotationTool.invert(selectedInstance.mask, true);

    const invertedContour = annotationTool.invertContour(
      selectedInstance.contour
    );

    const invertedBoundingBox = annotationTool.computeBoundingBoxFromContours(
      invertedContour
    );

    const instance = annotations.filter((instance: SelectionType) => {
      return instance.id === selectedAnnotation.id;
    })[0];

    if (!selectedAnnotation) return;

    dispatch(
      setSelectedAnnotation({
        selectedAnnotation: {
          ...instance,
          boundingBox: invertedBoundingBox,
          contour: invertedContour,
          mask: invertedMask,
        },
      })
    );

    annotationTool.mask = invertedMask;
    annotationTool.boundingBox = invertedBoundingBox;
    annotationTool.contour = invertedContour;

    dispatch(applicationSlice.actions.setAnnotated({ annotated: true }));
  }, [invertMode]);

  useEffect(() => {
    if (toolType === ToolType.Zoom) return;

    if (selectionMode === AnnotationModeType.New) return;

    if (!annotated || !annotationTool) return;

    dispatch(applicationSlice.actions.setAnnotating({ annotating: false }));

    if (!annotationTool.annotated) return;

    let combinedMask, combinedContour;

    const selectedInstance = selectedAnnotation;

    if (!selectedInstance) return;

    if (selectionMode === AnnotationModeType.Add) {
      [combinedMask, combinedContour] = annotationTool.add(
        selectedInstance.mask
      );
    } else if (selectionMode === AnnotationModeType.Subtract) {
      [combinedMask, combinedContour] = annotationTool.subtract(
        selectedInstance.mask
      );
    } else if (selectionMode === AnnotationModeType.Intersect) {
      [combinedMask, combinedContour] = annotationTool.intersect(
        selectedInstance.mask
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
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: {
          ...selectedInstance,
          boundingBox: annotationTool.boundingBox,
          contour: annotationTool.contour,
          mask: annotationTool.mask,
        },
      })
    );

    dispatch(
      setSelectedAnnotationsIds({
        selectedAnnotationsIds: [
          ...selectedAnnotationsIds,
          selectedInstance.id,
        ],
      })
    );
  }, [annotated]);

  useEffect(() => {
    if (toolType === ToolType.Zoom) return;

    if (selectionMode === AnnotationModeType.New) return;

    if (!annotating) return;

    if (!selectedAnnotation || !selectedAnnotation.id) return;

    transformerRef.current?.detach();

    //remove the existing Operator since it's essentially been replaced
    dispatch(
      applicationSlice.actions.deleteImageInstance({
        id: selectedAnnotation.id,
      })
    );
    const transformerId = "tr-".concat(selectedAnnotation.id);
    detachTransformer(transformerId);
  }, [annotating]);

  useEffect(() => {
    if (!selectedAnnotationsIds) return;

    if (!annotations) return;

    const updated = _.map(selectedAnnotationsIds, (annotationId) => {
      return {
        ...annotations?.filter(
          (instance: SelectionType) => instance.id === annotationId
        )[0],
        categoryId: selectedCategory.id,
      } as SelectionType;
    });

    console.info(updated);

    const others = annotations?.filter(
      (instance: SelectionType) =>
        !_.includes(selectedAnnotationsIds, instance.id)
    );

    console.info(others);

    dispatch(
      applicationSlice.actions.setImageInstances({
        instances: [...others, ...updated],
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
      if (!annotationTool.annotation) return;

      dispatch(
        applicationSlice.actions.setSelectedAnnotation({
          selectedAnnotation: annotationTool.annotation,
        })
      );

      dispatch(
        setSelectedAnnotationsIds({
          selectedAnnotationsIds: [
            ...selectedAnnotationsIds,
            annotationTool.annotation.id,
          ],
        })
      );
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
    if (!annotated) return;

    if (!transformerRef || !transformerRef.current) return;

    if (!annotationTool || !annotationTool.contour) return;

    if (!stageRef || !stageRef.current) return;

    const transform = stageRef.current.getAbsoluteTransform().copy();

    const scaledContour: Array<number> = _.flatten(
      _.chunk(annotationTool.contour, 2).map((el: Array<number>) => {
        const transformed = transform.point({ x: el[0], y: el[1] });
        return [transformed.x, transformed.y];
      })
    );

    selectingRef.current = new Konva.Line<Konva.LineConfig>({
      points: scaledContour,
    });

    const node = stageRef.current.findOne("#selected");

    if (!node) return;

    transformerRef.current.nodes([node]);

    const layer = transformerRef.current.getLayer();

    if (!layer) return;

    layer.batchDraw();

    if (!annotationTool) return;

    annotationTool.annotate(selectedCategory);

    if (!annotationTool.annotation) return;

    if (selectionMode !== AnnotationModeType.New) return;

    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: annotationTool.annotation,
      })
    );
    dispatch(
      setSelectedAnnotation({
        selectedAnnotation: annotationTool.annotation,
      })
    );
  }, [annotated]);

  /*
   * Connect Konva.Transformer to selected annotation Konva.Node
   */
  useEffect(() => {
    if (!stageRef || !stageRef.current) return;

    if (!selectedAnnotation || !selectedAnnotation.id) return;

    const node = stageRef.current.findOne(`#${selectedAnnotation.id}`);

    if (!node) return;

    if (!transformerRef || !transformerRef.current) return;

    transformerRef.current.nodes([node]);

    if (!annotations) return;
  }, [selectedAnnotation?.id]);

  useEffect(() => {
    _.map(selectedAnnotationsIds, (annotationId) => {
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
  }, [selectedAnnotationsIds]);

  const getRelativePointerPosition = (position: { x: number; y: number }) => {
    if (!imageRef || !imageRef.current) return;

    const transform = imageRef.current.getAbsoluteTransform().copy();

    transform.invert();

    return transform.point(position);
  };

  const onMouseDown = useMemo(() => {
    const func = () => {
      if (toolType === ToolType.Pointer) return;

      if (toolType === ToolType.Hand) return;

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

      setCurrentPosition(relative);

      if (!relative) return;

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

  useEffect(() => {
    if (!enterPress) return;

    if (!annotations || !annotationTool || annotationTool.annotating) return;

    if (!selectedAnnotation) return;

    const annotationIds = _.map(annotations, (annotation: AnnotationType) => {
      return annotation.id;
    });

    // add instance only if not already there
    _.forEach(selectedAnnotationsIds, (selectedAnnotationId: string) => {
      if (!annotationIds.includes(selectedAnnotationId)) {
        dispatch(
          applicationSlice.actions.setImageInstances({
            instances: [...annotations, selectedAnnotation],
          })
        );
      }
    });

    if (soundEnabled) playCreateAnnotationSoundEffect();

    deselectAnnotation();

    dispatch(applicationSlice.actions.setAnnotated({ annotated: false }));

    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: undefined,
      })
    );

    if (selectionMode !== AnnotationModeType.New)
      dispatch(
        applicationSlice.actions.setSelectionMode({
          selectionMode: AnnotationModeType.New,
        })
      );

    if (!selectedAnnotationsIds.length) return;

    deselectAllAnnotations();
  }, [enterPress]);

  useEffect(() => {
    if (
      toolType !== ToolType.PolygonalAnnotation &&
      toolType !== ToolType.LassoAnnotation
    )
      return;

    if (!annotationTool) return;

    annotationTool.connect();
  }, [enterPress]);

  useEffect(() => {
    if (selectedAnnotationsIds) {
      if (backspacePress || escapePress || deletePress) {
        if (deletePress || backspacePress) {
          _.map(selectedAnnotationsIds, (annotationId: string) => {
            dispatch(
              applicationSlice.actions.deleteImageInstance({
                id: annotationId,
              })
            );
          });
        }

        deselectAllAnnotations();

        if (soundEnabled) playDeleteAnnotationSoundEffect();

        dispatch(
          applicationSlice.actions.setSelectedAnnotation({
            selectedAnnotation: undefined,
          })
        );
        deselectAnnotation();
      }
    }
  }, [backspacePress, deletePress, escapePress]);

  useEffect(() => {
    if (!escape) return;
    if (toolType !== ToolType.Zoom) return;
    onZoomDeselect();
  }, [escapePress]);

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
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onWheel={onZoomWheel}
          ref={stageRef}
          width={stageWidth}
        >
          <Provider store={store}>
            <Layer>
              <Image ref={imageRef} />

              <ZoomSelection />

              <Selecting tool={tool!} />

              {currentPosition &&
                !annotationTool?.annotating &&
                toolType === ToolType.PenAnnotation && (
                  <ReactKonva.Ellipse
                    radiusX={(aspectRatio * penSelectionBrushSize) / stageScale}
                    radiusY={penSelectionBrushSize / stageScale}
                    x={currentPosition.x}
                    y={currentPosition.y}
                    stroke="grey"
                    strokewidth={1}
                    dash={[2, 2]}
                  />
                )}

              {selectedAnnotation && (
                <SelectedContour points={selectedAnnotation.contour} />
              )}

              <Annotations annotationTool={annotationTool} />

              <ReactKonva.Transformer ref={transformerRef} />

              <Transformers />

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
