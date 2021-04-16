import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import Konva from "konva";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ToolType } from "../../../../../types/ToolType";
import {
  annotatingSelector,
  imageInstancesSelector,
  invertModeSelector,
  selectedCategroySelector,
  selectionModeSelector,
  stageHeightSelector,
  stageScaleSelector,
  stageWidthSelector,
  toolTypeSelector,
  zoomSelectionSelector,
} from "../../../../../store/selectors";
import {
  applicationSlice,
  setSelectedAnnotationId,
} from "../../../../../store";
import {
  Provider,
  ReactReduxContext,
  useDispatch,
  useSelector,
} from "react-redux";
import { useKeyPress } from "../../../../../hooks/useKeyPress";
import { useAnnotationTool, useHandTool, useZoom } from "../../../../../hooks";
import { AnnotationType as SelectionType } from "../../../../../types/AnnotationType";
import { penSelectionBrushSizeSelector } from "../../../../../store/selectors/penSelectionBrushSizeSelector";
import { AnnotationModeType } from "../../../../../types/AnnotationModeType";
import { SelectedContour } from "../SelectedContour";
import { Image } from "../Image";
import { Annotations } from "../Annotations";
import { selectedAnnotationIdSelector } from "../../../../../store/selectors/selectedAnnotationIdSelector";
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

export const Stage = () => {
  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const transformerRef = useRef<Konva.Transformer | null>(null);
  const selectingRef = useRef<Konva.Line | null>(null);

  const toolType = useSelector(toolTypeSelector);

  const invertMode = useSelector(invertModeSelector);
  const penSelectionBrushSize = useSelector(penSelectionBrushSizeSelector);
  const selectedAnnotationId = useSelector(selectedAnnotationIdSelector);
  const selectedCategory = useSelector(selectedCategroySelector);
  const selectionMode = useSelector(selectionModeSelector);

  const stageHeight = useSelector(stageHeightSelector);
  const stageWidth = useSelector(stageWidthSelector);

  const [aspectRatio, setAspectRatio] = useState<number>(1);

  const stageScale = useSelector(stageScaleSelector);

  const dispatch = useDispatch();

  const {
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

  const deselectAnnotation = () => {
    if (!annotationTool) return;

    annotationTool.deselect();

    dispatch(
      setSelectedAnnotationId({
        selectedAnnotationId: undefined,
      })
    );

    transformerRef.current?.detach();
    transformerRef.current?.getLayer()?.batchDraw();

    selectingRef.current = null;
  };

  useEffect(() => {
    if (!selectedAnnotationId || !annotationTool) return;

    if (!annotations) return;

    const selectedInstance: SelectionType = annotations.filter(
      (instance: SelectionType) => {
        return instance.id === selectedAnnotationId;
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
      return instance.id === selectedAnnotationId;
    })[0];

    if (!selectedAnnotation) return;

    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
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
  }, [annotated]);

  useEffect(() => {
    if (toolType === ToolType.Zoom) return;

    if (selectionMode === AnnotationModeType.New) return;

    if (!annotating) return;

    if (!selectedAnnotationId) return;

    transformerRef.current?.detach();

    //remove the existing Operator since it's essentially been replaced
    dispatch(
      applicationSlice.actions.deleteImageInstance({
        id: selectedAnnotationId,
      })
    );
  }, [annotating]);

  useEffect(() => {
    if (!selectedAnnotationId) return;

    if (!selectedAnnotation) return;

    const others = annotations?.filter(
      (instance: SelectionType) => instance.id !== selectedAnnotationId
    );

    const updated: SelectionType = {
      ...annotations?.filter(
        (instance: SelectionType) => instance.id === selectedAnnotationId
      )[0],
      categoryId: selectedCategory.id,
    } as SelectionType;

    dispatch(
      applicationSlice.actions.setImageInstances({
        instances: [...(others as Array<SelectionType>), updated],
      })
    );

    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: updated,
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
      setSelectedAnnotationId({
        selectedAnnotationId: annotationTool.annotation.id,
      })
    );
  }, [annotated]);

  /*
   * Connect Konva.Transformer to selected annotation Konva.Node
   */
  useEffect(() => {
    if (!stageRef || !stageRef.current) return;

    if (!selectedAnnotationId) return;

    const node = stageRef.current.findOne(`#${selectedAnnotationId}`);

    if (!node) return;

    if (!transformerRef || !transformerRef.current) return;

    transformerRef.current.nodes([node]);

    if (!annotations) return;

    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: annotations.filter((v: SelectionType) => {
          // @ts-ignore
          return v.id === selectedAnnotationId;
        })[0],
      })
    );
  }, [selectedAnnotationId]);

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

    if (selectedAnnotationId === selectedAnnotation.id) {
      dispatch(
        applicationSlice.actions.replaceImageInstance({
          id: selectedAnnotation.id,
          instance: selectedAnnotation,
        })
      );
    } else {
      dispatch(
        applicationSlice.actions.setImageInstances({
          instances: [...annotations, selectedAnnotation],
        })
      );
    }

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
    if (selectedAnnotationId) {
      if (backspacePress || escapePress || deletePress) {
        dispatch(
          applicationSlice.actions.deleteImageInstance({
            id: selectedAnnotationId,
          })
        );

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
