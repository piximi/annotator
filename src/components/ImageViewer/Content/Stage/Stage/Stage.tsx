import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import Konva from "konva";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import useImage from "use-image";
import {
  ColorSelectionOperator,
  EllipticalSelectionOperator,
  LassoSelectionOperator,
  MagneticSelectionOperator,
  ObjectSelectionOperator,
  PolygonalSelectionOperator,
  QuickSelectionOperator,
  RectangularSelectionOperator,
  SelectionOperator,
} from "../../../../../image/selection";
import { Operation } from "../../../../../types/Operation";
import {
  categoriesSelector,
  imageInstancesSelector,
  invertModeSelector,
  operationSelector,
  selectionModeSelector,
} from "../../../../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useStyles } from "../../Content/Content.css";
import * as ImageJS from "image-js";
import { Selection } from "../Selection";
import { Category } from "../../../../../types/Category";
import { slice } from "../../../../../store/slices";
import { useKeyPress } from "../../../../../hooks/useKeyPress/useKeyPress";
import { shadeHex } from "../../../../../image/shade";
import { useMarchingAnts } from "../../../../../hooks";
import { Selection as SelectionType } from "../../../../../types/Selection";
import { PenSelectionOperator } from "../../../../../image/selection/PenSelectionOperator";
import { visibleCategoriesSelector } from "../../../../../store/selectors/visibleCategoriesSelector";
import { penSelectionBrushSizeSelector } from "../../../../../store/selectors/penSelectionBrushSizeSelector";
import { SelectionMode } from "../../../../../types/SelectionMode";
import { SelectedContour } from "../SelectedContour";

type StageProps = {
  category: Category;
  src: string;
};

export const Stage = ({ category, src }: StageProps) => {
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

  const [operator, setOperator] = useState<SelectionOperator>();

  const [selectionId, setSelectionId] = useState<string>();
  const [selected, setSelected] = useState<boolean>(false);

  const [, update] = useReducer((x) => x + 1, 0);

  const dispatch = useDispatch();

  const instances = useSelector(imageInstancesSelector);

  const categories = useSelector(categoriesSelector);
  const visibleCategories = useSelector(visibleCategoriesSelector);

  const enterPress = useKeyPress("Enter");
  const escapePress = useKeyPress("Escape");
  const deletePress = useKeyPress("Delete");
  const backspacePress = useKeyPress("Backspace");

  const dashOffset = useMarchingAnts();

  useEffect(() => {
    if (!selectionId || !operator) return;

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

    const invertedMask = operator.invert(selectedInstance.mask, true);

    const invertedContour = operator.invertContour(selectedInstance.contour);

    const invertedBoundingBox = operator.computeBoundingBoxFromContours(
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
  }, [invertMode]);

  useEffect(() => {
    if (selectionMode === SelectionMode.New) return; // "New" mode

    if (!selected || !operator || !selectionId || !instances) return;

    let combinedMask, combinedContour;

    const selectedInstance: SelectionType = instances.filter(
      (instance: SelectionType) => {
        return instance.id === selectionId;
      }
    )[0];

    if (!selectedInstance) return;

    if (selectionMode === SelectionMode.Add) {
      [combinedMask, combinedContour] = operator.add(selectedInstance.mask);
    } else if (selectionMode === SelectionMode.Subtract) {
      [combinedMask, combinedContour] = operator.subtract(
        selectedInstance.mask
      );
    } else if (selectionMode === SelectionMode.Intersect) {
      [combinedMask, combinedContour] = operator.intersect(
        selectedInstance.mask
      );
    }

    operator.mask = combinedMask;
    operator.contour = combinedContour;

    if (!combinedContour) return;
    operator.boundingBox = operator.computeBoundingBoxFromContours(
      combinedContour
    );

    //remove the existing selection since it's essentially been replaced
    dispatch(
      slice.actions.deleteImageInstance({
        id: selectionId,
      })
    );
  }, [selectionMode, selected]);

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
    ImageJS.Image.load(src).then((image: ImageJS.Image) => {
      switch (operation) {
        case Operation.ColorSelection:
          setOperator(new ColorSelectionOperator(image));

          return;
        case Operation.EllipticalSelection:
          setOperator(new EllipticalSelectionOperator(image));

          return;
        case Operation.LassoSelection:
          setOperator(new LassoSelectionOperator(image));

          return;
        case Operation.MagneticSelection:
          setOperator(new MagneticSelectionOperator(image));

          return;
        case Operation.ObjectSelection:
          ObjectSelectionOperator.compile(image).then(
            (operator: ObjectSelectionOperator) => {
              setOperator(operator);
            }
          );

          return;
        case Operation.PenSelection:
          PenSelectionOperator.setup(image, penSelectionBrushSize).then(
            (operator: PenSelectionOperator) => {
              setOperator(operator);
            }
          );

          return;
        case Operation.PolygonalSelection:
          setOperator(new PolygonalSelectionOperator(image));

          return;
        case Operation.QuickSelection:
          const quickSelectionOperator = QuickSelectionOperator.setup(image);
          setOperator(quickSelectionOperator);

          return;
        case Operation.RectangularSelection:
          setOperator(new RectangularSelectionOperator(image));

          return;
      }
    });
  }, [operation, src]);

  useEffect(() => {
    if (!operator) return;

    if (operator.selected) setSelected(operator.selected);
  });

  useEffect(() => {
    if (operation !== Operation.PenSelection) return;

    // @ts-ignore
    operator.brushSize = penSelectionBrushSize;
  }, [penSelectionBrushSize]);

  useEffect(() => {
    if (!operator || !operator.contour) return;
    selectingRef.current = new Konva.Line<Konva.LineConfig>({
      points: operator.contour,
    });
  });

  useEffect(() => {
    if (!selected) return;

    if (!transformerRef || !transformerRef.current) return;

    if (!selectingRef || !selectingRef.current) return;

    if (!operator || !operator.contour) return;

    transformerRef.current.nodes([selectingRef.current]);

    const layer = transformerRef.current.getLayer();

    if (!layer) return;

    layer.batchDraw();

    if (!operator) return;

    operator.select(category);

    if (!operator.selection) return;

    selectionInstanceRef.current = operator.selection;
  }, [selected]);

  const onContextMenuClick = (
    event: Konva.KonvaEventObject<MouseEvent>,
    instance: SelectionType
  ) => {
    event.evt.preventDefault();

    if (!operator) return;

    if (operator.selecting) return;

    if (!instances) return;

    operator.deselect();

    selectionInstanceRef.current = instances.filter((v: SelectionType) => {
      // @ts-ignore
      return v.id === instance.id;
    })[0];

    setSelected(true);

    setSelectionId(instance.id);

    dispatch(
      slice.actions.setSeletedCategory({
        selectedCategory: instance.categoryId,
      })
    );

    setSelected(false);

    selectionLineRef.current = event.target as Konva.Line;

    transformerRef.current?.nodes([selectionLineRef.current]);
  };

  //FIXME not using useMemo() because could not pass event argument to it
  const onMouseDown = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (event.evt.button === 0) {
      // left click only
      if (!operator || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      operator.onMouseDown(position);

      update();
    }
  };

  const onMouseMove = useMemo(() => {
    const func = () => {
      if (!operator || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      operator.onMouseMove(position);

      update();
    };

    const throttled = _.throttle(func, 5);

    return () => throttled();
  }, [operator]);

  const onMouseUp = useMemo(() => {
    const func = () => {
      if (!operator || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      operator.onMouseUp(position);

      update();
    };

    const throttled = _.throttle(func, 10);

    return () => throttled();
  }, [operator]);

  useEffect(() => {
    if (!enterPress) return;

    if (!instances || !operator) return;

    if (!selectionInstanceRef || !selectionInstanceRef.current) return;

    dispatch(
      slice.actions.setImageInstances({
        instances: [...instances, selectionInstanceRef.current],
      })
    );

    operator.deselect();

    transformerRef.current?.detach();

    setSelected(false);

    selectingRef.current = null;
  }, [enterPress]);

  useEffect(() => {
    if (!selected) return;

    if (!escapePress) return;

    if (!operator) return;

    operator.deselect();

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
      }
    }
  }, [backspacePress, deletePress, escapePress]);

  return (
    <ReactKonva.Stage
      className={classes.stage}
      globalCompositeOperation="destination-over"
      height={512}
      ref={stageRef}
      width={512}
    >
      <ReactKonva.Layer
        onMouseDown={(event) => onMouseDown(event)}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <ReactKonva.Image ref={imageRef} image={image} />

        {!selected && <Selection operation={operation} operator={operator} />}

        {selected && operator && operator.contour && (
          <SelectedContour points={operator.contour} />
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
