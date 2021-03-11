import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import Konva from "konva";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import useImage from "use-image";
import { Tool } from "../../../../../types/Tool";
import {
  categoriesSelector,
  imageInstancesSelector,
  invertModeSelector,
  operationSelector,
  selectionModeSelector,
  zoomSettingsSelector,
} from "../../../../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useStyles } from "../../Content/Content.css";
import { Selection } from "../Selection";
import { Category } from "../../../../../types/Category";
import { slice } from "../../../../../store/slices";
import { useKeyPress } from "../../../../../hooks/useKeyPress";
import { useAnnotationOperator } from "../../../../../hooks";
import { Selection as SelectionType } from "../../../../../types/Selection";
import { visibleCategoriesSelector } from "../../../../../store/selectors/visibleCategoriesSelector";
import { penSelectionBrushSizeSelector } from "../../../../../store/selectors/penSelectionBrushSizeSelector";
import { SelectionMode } from "../../../../../types/SelectionMode";
import { SelectedContour } from "../SelectedContour";
import { useZoomOperator } from "../../../../../hooks/useZoomOperator";

type StageProps = {
  category: Category;
  height?: number;
  src: string;
  width?: number;
};

export const Stage = ({ category, height, src, width }: StageProps) => {
  const [image] = useImage(src, "Anonymous");

  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const transformerRef = useRef<Konva.Transformer | null>(null);
  const selectionLineRef = useRef<Konva.Line | null>(null);
  const selectingRef = useRef<Konva.Line | null>(null);

  const selectionInstanceRef = useRef<SelectionType | null>(null);

  const classes = useStyles();

  const operation = useSelector(operationSelector);

  const penSelectionBrushSize = useSelector(penSelectionBrushSizeSelector);

  const selectionMode = useSelector(selectionModeSelector);

  const invertMode = useSelector(invertModeSelector);

  const [annotationOperator] = useAnnotationOperator(src);

  const [selectionId, setSelectionId] = useState<string>();
  const [selected, setSelected] = useState<boolean>(false);
  const [selecting, setSelecting] = useState<boolean>(false);

  const [, update] = useReducer((x) => x + 1, 0);

  const dispatch = useDispatch();

  const instances = useSelector(imageInstancesSelector);

  const categories = useSelector(categoriesSelector);
  const visibleCategories = useSelector(visibleCategoriesSelector);

  const zoomSettings = useSelector(zoomSettingsSelector);

  const enterPress = useKeyPress("Enter");
  const escapePress = useKeyPress("Escape");
  const deletePress = useKeyPress("Delete");
  const backspacePress = useKeyPress("Backspace");

  // const {onWheel, onZoomMouseDown, scale, x, y} = useZoomOperator(operation, src, zoomSettings);
  const zoomOperator = useZoomOperator(operation, src, zoomSettings);

  useEffect(() => {
    if (operation === Tool.Zoom) return;

    if (!selectionId || !annotationOperator) return;

    if (!instances) return;

    const selectedInstance: SelectionType = instances.filter(
      (instance: SelectionType) => {
        return instance.id === selectionId;
      }
    )[0];

    if (
      !selectedInstance ||
      !selectedInstance.mask ||
      !selectedInstance.contour
    )
      return;

    const invertedMask = annotationOperator.invert(selectedInstance.mask, true);

    const invertedContour = annotationOperator.invertContour(
      selectedInstance.contour
    );

    const invertedBoundingBox = annotationOperator.computeBoundingBoxFromContours(
      invertedContour
    );

    const instance = instances.filter((instance: SelectionType) => {
      return instance.id === selectionId;
    })[0];

    if (!selectionInstanceRef || !selectionInstanceRef.current) return;

    selectionInstanceRef.current = {
      ...instance,
      boundingBox: invertedBoundingBox,
      contour: invertedContour,
      mask: invertedMask,
    };

    dispatch(
      slice.actions.deleteImageInstance({
        id: selectionId,
      })
    );

    //dispatch call is async so let's make sure we don't add the same instance twice
    const otherInstances = instances.filter((v) => {
      return v.id !== selectionId;
    });

    dispatch(
      slice.actions.setImageInstances({
        instances: [...otherInstances, selectionInstanceRef.current],
      })
    );
  }, [invertMode]);

  useEffect(() => {
    if (operation === Tool.Zoom) return;

    if (selectionMode === SelectionMode.New) return; // "New" mode

    setSelecting(false);

    if (!selected || !annotationOperator || !selectionId || !instances) return;

    let combinedMask, combinedContour;

    const selectedInstance = selectionInstanceRef.current;

    if (!selectedInstance) return;

    if (selectionMode === SelectionMode.Add) {
      [combinedMask, combinedContour] = annotationOperator.add(
        selectedInstance.mask
      );
    } else if (selectionMode === SelectionMode.Subtract) {
      [combinedMask, combinedContour] = annotationOperator.subtract(
        selectedInstance.mask
      );
    } else if (selectionMode === SelectionMode.Intersect) {
      [combinedMask, combinedContour] = annotationOperator.intersect(
        selectedInstance.mask
      );
    }

    annotationOperator.mask = combinedMask;
    annotationOperator.contour = combinedContour;

    if (!combinedContour) return;
    annotationOperator.boundingBox = annotationOperator.computeBoundingBoxFromContours(
      combinedContour
    );
  }, [selectionMode, selected]);

  useEffect(() => {
    if (operation === Tool.Zoom) return;

    if (selectionMode === SelectionMode.New) return;

    if (!selecting) return;

    if (!selectionId) return;

    transformerRef.current?.detach();

    //remove the existing Operator since it's essentially been replaced
    dispatch(
      slice.actions.deleteImageInstance({
        id: selectionId,
      })
    );
  }, [selecting]);

  useEffect(() => {
    if (!selectionId) return;

    const others = instances?.filter(
      (instance: SelectionType) => instance.id !== selectionId
    );

    const updated: SelectionType = {
      ...instances?.filter(
        (instance: SelectionType) => instance.id === selectionId
      )[0],
      categoryId: category.id,
    } as SelectionType;

    dispatch(
      slice.actions.setImageInstances({
        instances: [...(others as Array<SelectionType>), updated],
      })
    );
  }, [category]);

  useEffect(() => {
    if (!annotationOperator) return;

    if (annotationOperator.annotated) setSelected(annotationOperator.annotated);

    if (selectionMode === SelectionMode.New) return;

    if (annotationOperator.annotating)
      setSelecting(annotationOperator.annotating);
  });

  useEffect(() => {
    if (operation !== Tool.PenAnnotation) return;

    // @ts-ignore
    annotationOperator.brushSize = penSelectionBrushSize;
  }, [penSelectionBrushSize]);

  useEffect(() => {
    if (!annotationOperator || !annotationOperator.contour) return;

    const scale = zoomOperator ? zoomOperator.scale : 1;
    const x = zoomOperator ? zoomOperator.x : 1;
    const y = zoomOperator ? zoomOperator.y : 1;

    const scaledContour: Array<number> = _.flatten(
      _.chunk(annotationOperator.contour, 2).map((el: Array<number>) => {
        return [el[0] * scale + x, el[1] * scale + y];
      })
    );

    selectingRef.current = new Konva.Line<Konva.LineConfig>({
      points: scaledContour,
    });
  }, [annotationOperator?.contour, selected]);

  useEffect(() => {
    if (!selected) return;

    if (!transformerRef || !transformerRef.current) return;

    if (!selectingRef || !selectingRef.current) return;

    if (!annotationOperator || !annotationOperator.contour) return;

    transformerRef.current.nodes([selectingRef.current]);

    const layer = transformerRef.current.getLayer();

    if (!layer) return;

    layer.batchDraw();

    if (!annotationOperator) return;

    annotationOperator.annotate(category);

    if (!annotationOperator.annotation) return;
    selectionInstanceRef.current = annotationOperator.annotation;
  }, [selected]);

  const onContextMenuClick = (
    event: Konva.KonvaEventObject<MouseEvent>,
    instance: SelectionType
  ) => {
    event.evt.preventDefault();

    if (!annotationOperator) return;

    if (annotationOperator.annotating) return;

    if (!instances) return;

    annotationOperator.deselect();

    selectionInstanceRef.current = instances.filter((v: SelectionType) => {
      // @ts-ignore
      return v.id === instance.id;
    })[0];

    setSelectionId(instance.id);

    dispatch(
      slice.actions.setSeletedCategory({
        selectedCategory: instance.categoryId,
      })
    );

    selectionLineRef.current = event.target as Konva.Line;

    transformerRef.current?.nodes([selectionLineRef.current]);
  };

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
      if (!annotationOperator || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      if (!relative) return;

      if (operation === Tool.Zoom) {
        zoomOperator?.onMouseDown(relative);
      } else {
        annotationOperator.onMouseDown(relative);
      }

      update();
    }
  };

  const onMouseMove = useMemo(() => {
    const func = () => {
      if (!annotationOperator || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      if (!relative) return;

      if (operation === Tool.Zoom) {
        zoomOperator?.onMouseMove(relative);
      } else {
        annotationOperator.onMouseMove(relative);
      }

      update();
    };

    const throttled = _.throttle(func, 5);

    return () => throttled();
  }, [annotationOperator, zoomOperator]);

  const onMouseUp = useMemo(() => {
    const func = () => {
      if (!annotationOperator || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      if (!relative) return;

      if (operation === Tool.Zoom) {
        zoomOperator?.onMouseUp(relative);
      } else {
        annotationOperator.onMouseUp(relative);
      }

      update();
    };

    const throttled = _.throttle(func, 10);

    return () => throttled();
  }, [annotationOperator, zoomOperator]);

  useEffect(() => {
    if (!enterPress) return;

    if (!instances || !annotationOperator) return;

    if (!selectionInstanceRef || !selectionInstanceRef.current) return;

    if (selectionId !== selectionInstanceRef.current.id) {
      dispatch(
        slice.actions.setImageInstances({
          instances: [...instances, selectionInstanceRef.current],
        })
      );
    }

    annotationOperator.deselect();

    transformerRef.current?.detach();
    transformerRef.current?.getLayer()?.batchDraw();

    setSelected(false);

    selectingRef.current = null;

    selectionInstanceRef.current = null;
  }, [enterPress]);

  useEffect(() => {
    if (!selected) return;

    if (!escapePress) return;

    if (!annotationOperator) return;

    annotationOperator.deselect();

    transformerRef.current?.detach();
  }, [escapePress]);

  useEffect(() => {
    if (selectionId) {
      if (backspacePress || escapePress || deletePress) {
        dispatch(
          slice.actions.deleteImageInstance({
            id: selectionId,
          })
        );

        transformerRef.current?.detach();

        selectionInstanceRef.current = null;
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
    <ReactKonva.Stage
      className={classes.stage}
      globalCompositeOperation="destination-over"
      height={512}
      ref={stageRef}
      // onWheel={zoomOperator?.onWheel}
      scale={{
        x: zoomOperator ? zoomOperator.scale : 1,
        y: zoomOperator ? zoomOperator.scale : 1,
      }}
      width={512}
      x={zoomOperator ? zoomOperator.x : 0}
      y={zoomOperator ? zoomOperator.x : 0}
    >
      <ReactKonva.Layer
        onMouseDown={(event) => onMouseDown(event)}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <ReactKonva.Image
          ref={imageRef}
          image={image}
          position={{ x: 0, y: 0 }}
          width={512}
          height={512}
        />

        {!selected && (
          <Selection operation={operation} operator={annotationOperator} />
        )}

        {!selected && operation === Tool.Zoom && (
          <Selection operation={operation} operator={zoomOperator} />
        )}

        {selected && annotationOperator && annotationOperator.contour && (
          <SelectedContour points={annotationOperator.contour} />
        )}

        {selectionMode !== SelectionMode.New &&
          annotationOperator &&
          annotationOperator.annotating &&
          !annotationOperator.annotated &&
          selectionInstanceRef &&
          selectionInstanceRef.current && (
            <SelectedContour points={selectionInstanceRef.current.contour} />
          )}

        {instances &&
          instances.map((instance: SelectionType) => {
            if (visibleCategories.includes(instance.categoryId)) {
              return (
                <ReactKonva.Line
                  closed={true}
                  key={instance.id}
                  points={instance.contour}
                  fill={
                    _.find(
                      categories,
                      (category: Category) =>
                        category.id === instance.categoryId
                    )?.color
                  }
                  onContextMenu={(event) => onContextMenuClick(event, instance)}
                  opacity={0.5}
                  ref={selectionLineRef}
                  // stroke={shadeHex(category.color, 50)}
                  strokeWidth={1}
                />
              );
            } else {
              return <React.Fragment />;
            }
          })}

        <ReactKonva.Transformer ref={transformerRef} />
      </ReactKonva.Layer>
    </ReactKonva.Stage>
  );
};
