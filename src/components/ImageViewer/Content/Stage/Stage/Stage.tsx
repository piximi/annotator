import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import Konva from "konva";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ToolType } from "../../../../../types/ToolType";
import {
  imageInstancesSelector,
  invertModeSelector,
  toolTypeSelector,
  selectionModeSelector,
  zoomSettingsSelector,
} from "../../../../../store/selectors";
import {
  Provider,
  ReactReduxContext,
  useDispatch,
  useSelector,
} from "react-redux";
import { useStyles } from "../../Content/Content.css";
import { Selection } from "../Selection";
import { Category } from "../../../../../types/Category";
import { slice } from "../../../../../store";
import { useKeyPress } from "../../../../../hooks/useKeyPress";
import { useAnnotationOperator } from "../../../../../hooks";
import { Selection as SelectionType } from "../../../../../types/Selection";
import { penSelectionBrushSizeSelector } from "../../../../../store/selectors/penSelectionBrushSizeSelector";
import { SelectionMode } from "../../../../../types/SelectionMode";
import { SelectedContour } from "../SelectedContour";
import { useZoomOperator } from "../../../../../hooks/useZoomOperator";
import { KonvaEventObject } from "konva/types/Node";
import { Image } from "../Image";
import { Annotations } from "../Annotations";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";

type StageProps = {
  category: Category;
  height?: number;
  src: string;
  width?: number;
};

export const Stage = ({ category, height, src, width }: StageProps) => {
  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const transformerRef = useRef<Konva.Transformer | null>(null);
  const selectingRef = useRef<Konva.Line | null>(null);

  const selectedAnnotationRef = useRef<SelectionType | null>(null);

  const classes = useStyles();

  const tool = useSelector(toolTypeSelector);

  const invertMode = useSelector(invertModeSelector);
  const penSelectionBrushSize = useSelector(penSelectionBrushSizeSelector);
  const selectedAnnotation = useSelector(selectedAnnotationSelector);
  const selectionMode = useSelector(selectionModeSelector);

  const [annotationTool] = useAnnotationOperator(src);

  const [selected, setSelected] = useState<boolean>(false);
  const [selecting, setSelecting] = useState<boolean>(false);

  const [, update] = useReducer((x) => x + 1, 0);

  const dispatch = useDispatch();

  const annotations = useSelector(imageInstancesSelector);

  const zoomSettings = useSelector(zoomSettingsSelector);

  const enterPress = useKeyPress("Enter");
  const escapePress = useKeyPress("Escape");
  const deletePress = useKeyPress("Delete");
  const backspacePress = useKeyPress("Backspace");

  const { zoomOperator, onZoomClick, onZoomWheel } = useZoomOperator(
    tool,
    src,
    zoomSettings
  );

  const onClick = (event: KonvaEventObject<MouseEvent>) => {
    switch (tool) {
      case ToolType.Zoom:
        onZoomClick(event);
    }
  };

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    switch (tool) {
      case ToolType.Zoom:
        onZoomWheel(event);
    }
  };

  useEffect(() => {
    if (tool === ToolType.Zoom) return;

    if (!selectedAnnotation || !annotationTool) return;

    if (!annotations) return;

    const selectedInstance: SelectionType = annotations.filter(
      (instance: SelectionType) => {
        return instance.id === selectedAnnotation;
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
      return instance.id === selectedAnnotation;
    })[0];

    if (!selectedAnnotationRef || !selectedAnnotationRef.current) return;

    selectedAnnotationRef.current = {
      ...instance,
      boundingBox: invertedBoundingBox,
      contour: invertedContour,
      mask: invertedMask,
    };

    annotationTool.mask = invertedMask;
    annotationTool.boundingBox = invertedBoundingBox;
    annotationTool.contour = invertedContour;

    setSelected(true);
  }, [invertMode]);

  useEffect(() => {
    if (tool === ToolType.Zoom) return;

    if (selectionMode === SelectionMode.New) return; // "New" mode

    setSelecting(false);

    if (!selected || !annotationTool || !selectedAnnotation || !annotations)
      return;

    let combinedMask, combinedContour;

    const selectedInstance = selectedAnnotationRef.current;

    if (!selectedInstance) return;

    if (selectionMode === SelectionMode.Add) {
      [combinedMask, combinedContour] = annotationTool.add(
        selectedInstance.mask
      );
    } else if (selectionMode === SelectionMode.Subtract) {
      [combinedMask, combinedContour] = annotationTool.subtract(
        selectedInstance.mask
      );
    } else if (selectionMode === SelectionMode.Intersect) {
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
  }, [selectionMode, selected]);

  useEffect(() => {
    if (tool === ToolType.Zoom) return;

    if (selectionMode === SelectionMode.New) return;

    if (!selecting) return;

    if (!selectedAnnotation) return;

    transformerRef.current?.detach();

    //remove the existing Operator since it's essentially been replaced
    dispatch(
      slice.actions.deleteImageInstance({
        id: selectedAnnotation,
      })
    );
  }, [selecting]);

  useEffect(() => {
    if (!selectedAnnotation) return;

    if (!selectedAnnotationRef || !selectedAnnotationRef.current) return;

    const others = annotations?.filter(
      (instance: SelectionType) => instance.id !== selectedAnnotation
    );

    const updated: SelectionType = {
      ...annotations?.filter(
        (instance: SelectionType) => instance.id === selectedAnnotation
      )[0],
      categoryId: category.id,
    } as SelectionType;

    dispatch(
      slice.actions.setImageInstances({
        instances: [...(others as Array<SelectionType>), updated],
      })
    );

    selectedAnnotationRef.current = updated;
  }, [category]);

  useEffect(() => {
    if (!annotationTool) return;

    if (annotationTool.annotated) setSelected(annotationTool.annotated);

    if (selectionMode === SelectionMode.New) return;

    if (annotationTool.annotating) setSelecting(annotationTool.annotating);
  });

  useEffect(() => {
    if (tool !== ToolType.PenAnnotation) return;

    // @ts-ignore
    annotationTool.brushSize = penSelectionBrushSize;
  }, [penSelectionBrushSize]);

  useEffect(() => {
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
  }, [annotationTool?.contour, selected]);

  useEffect(() => {
    if (!selected) return;

    if (!transformerRef || !transformerRef.current) return;

    if (!selectingRef || !selectingRef.current) return;

    if (!annotationTool || !annotationTool.contour) return;

    transformerRef.current.nodes([selectingRef.current]);

    const layer = transformerRef.current.getLayer();

    if (!layer) return;

    layer.batchDraw();

    if (!annotationTool) return;

    annotationTool.annotate(category);

    if (!annotationTool.annotation) return;
    selectedAnnotationRef.current = annotationTool.annotation;
  }, [selected]);

  /*
   * Connect Konva.Transformer to selected annotation Konva.Node
   */
  useEffect(() => {
    if (!stageRef || !stageRef.current) return;

    if (!selectedAnnotation) return;

    const node = stageRef.current.findOne(`#${selectedAnnotation}`);

    if (!node) return;

    if (!transformerRef || !transformerRef.current) return;

    transformerRef.current.nodes([node]);

    if (!annotations) return;

    selectedAnnotationRef.current = annotations.filter((v: SelectionType) => {
      // @ts-ignore
      return v.id === selectedAnnotation;
    })[0];
  }, [selectedAnnotation]);

  const getRelativePointerPosition = (position: { x: number; y: number }) => {
    if (!stageRef || !stageRef.current) return;

    const transform = stageRef.current.getAbsoluteTransform().copy();

    transform.invert();

    return transform.point(position);
  };

  //FIXME not using useMemo() because could not pass event argument to it
  const onMouseDown = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (event.evt.button === 0) {
      // left click only
      if (!annotationTool || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      if (!relative) return;

      if (tool === ToolType.Zoom) {
        zoomOperator?.onMouseDown(relative);
      } else {
        annotationTool.onMouseDown(relative);
      }

      update();
    }
  };

  const onMouseMove = useMemo(() => {
    const func = () => {
      if (!annotationTool || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      if (!relative) return;

      if (tool === ToolType.Zoom) {
        zoomOperator?.onMouseMove(relative);
      } else {
        annotationTool.onMouseMove(relative);
      }

      update();
    };

    const throttled = _.throttle(func, 5);

    return () => throttled();
  }, [annotationTool, tool, zoomOperator]);

  const onMouseUp = useMemo(() => {
    const func = () => {
      if (!annotationTool || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      if (!relative) return;

      if (tool === ToolType.Zoom) {
        zoomOperator?.onMouseUp(relative);
      } else {
        annotationTool.onMouseUp(relative);
      }

      update();
    };

    const throttled = _.throttle(func, 10);

    return () => throttled();
  }, [annotationTool, tool, zoomOperator]);

  useEffect(() => {
    if (!enterPress) return;

    if (!annotations || !annotationTool) return;

    if (!selectedAnnotationRef || !selectedAnnotationRef.current) return;

    if (selectedAnnotation === selectedAnnotationRef.current.id) {
      dispatch(
        slice.actions.replaceImageInstance({
          id: selectedAnnotationRef.current.id,
          instance: selectedAnnotationRef.current,
        })
      );
    } else {
      dispatch(
        slice.actions.setImageInstances({
          instances: [...annotations, selectedAnnotationRef.current],
        })
      );
    }

    annotationTool.deselect();

    transformerRef.current?.detach();
    transformerRef.current?.getLayer()?.batchDraw();

    setSelected(false);

    selectingRef.current = null;

    selectedAnnotationRef.current = null;
  }, [enterPress]);

  useEffect(() => {
    if (!selected) return;

    if (!escapePress) return;

    if (!annotationTool) return;

    annotationTool.deselect();

    transformerRef.current?.detach();
  }, [escapePress]);

  useEffect(() => {
    if (selectedAnnotation) {
      if (backspacePress || escapePress || deletePress) {
        dispatch(
          slice.actions.deleteImageInstance({
            id: selectedAnnotation,
          })
        );

        transformerRef.current?.detach();

        selectedAnnotationRef.current = null;
      }
    }
  }, [backspacePress, deletePress, escapePress]);

  useEffect(() => {
    if (!stageRef || !stageRef.current) return;
    const content = document.querySelector(
      ".konvajs-content"
    ) as HTMLDivElement;
    if (!content) return;
    content.style.marginLeft = "auto";
    content.style.marginRight = "auto";
  }, [stageRef.current]);

  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        <ReactKonva.Stage
          className={classes.stage}
          globalCompositeOperation="destination-over"
          height={512}
          onClick={onClick}
          onWheel={onWheel}
          ref={stageRef}
          scale={{
            x: zoomOperator ? zoomOperator.scale : 1,
            y: zoomOperator ? zoomOperator.scale : 1,
          }}
          width={512}
          x={zoomOperator ? zoomOperator.x : 0}
          y={zoomOperator ? zoomOperator.y : 0}
        >
          <Provider store={store}>
            <ReactKonva.Layer
              onMouseDown={(event) => onMouseDown(event)}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
            >
              <Image ref={imageRef} src={src} />

              {!selected && tool !== ToolType.Zoom && (
                <Selection
                  operation={tool}
                  operator={annotationTool}
                  scale={zoomOperator ? zoomOperator.scale : 1}
                />
              )}

              {!selected && tool === ToolType.Zoom && (
                <Selection
                  operation={tool}
                  operator={zoomOperator}
                  scale={zoomOperator ? zoomOperator.scale : 1}
                />
              )}

              {selected && annotationTool && annotationTool.contour && (
                <SelectedContour
                  points={annotationTool.contour}
                  scale={zoomOperator ? zoomOperator.scale : 1}
                />
              )}

              {selectionMode !== SelectionMode.New &&
                annotationTool &&
                annotationTool.annotating &&
                !annotationTool.annotated &&
                selectedAnnotationRef &&
                selectedAnnotationRef.current && (
                  <SelectedContour
                    points={selectedAnnotationRef.current.contour}
                    scale={zoomOperator ? zoomOperator.scale : 1}
                  />
                )}

              <Annotations annotationTool={annotationTool} />

              <ReactKonva.Transformer ref={transformerRef} />
            </ReactKonva.Layer>
          </Provider>
        </ReactKonva.Stage>
      )}
    </ReactReduxContext.Consumer>
  );
};
