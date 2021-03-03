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
import { decode } from "../../../../../image/rle";

type StageProps = {
  category: Category;
  src: string;
};

export const Stage = ({ category, src }: StageProps) => {
  const [image] = useImage(src, "Anonymous");

  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const transformerRef = useRef<Konva.Transformer | null>(null);
  const selectionRef = useRef<Konva.Line | null>(null);
  const selectingRef = useRef<Konva.Line | null>(null);

  const classes = useStyles();

  const operation = useSelector(operationSelector);

  const penSelectionBrushSize = useSelector(penSelectionBrushSizeSelector);

  const selectionMode = useSelector(selectionModeSelector);

  const [operator, setOperator] = useState<SelectionOperator>();

  const [selection, setSelection] = useState<string>();
  const [selectionMask, setSelectionMask] = useState<Array<number>>([]);
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
    if (selectionMode === 2) return; // "New" mode

    if (!selected || !operator) return;

    if (selectionMode === 0) {
      const combinedMask = operator.add(selectionMask);

      //the currect instance shousld use this new mask
    }
  }, [selectionMode, selected]);

  useEffect(() => {
    if (!selection) return;

    const others = instances?.filter(
      (instance: SelectionType) => instance.id !== selection
    );

    const updated: SelectionType = {
      ...instances?.filter(
        (instance: SelectionType) => instance.id === selection
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

    transformerRef.current.nodes([selectingRef.current]);

    const layer = transformerRef.current.getLayer();

    if (!layer) return;

    layer.batchDraw();
  }, [selected]);

  const onClick = (
    event: Konva.KonvaEventObject<MouseEvent>,
    instance: SelectionType
  ) => {
    if (!operator) return;

    if (operator.selecting) return;

    operator.deselect();

    setSelection(instance.id);
    setSelectionMask(instance.mask);

    dispatch(
      slice.actions.setSeletedCategory({
        selectedCategory: instance.categoryId,
      })
    );

    selectionRef.current = event.target as Konva.Line;

    transformerRef.current?.nodes([selectionRef.current]);
  };

  const onMouseDown = useMemo(() => {
    const func = () => {
      if (!operator || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      operator.onMouseDown(position);

      update();
    };

    const throttled = _.throttle(func, 10);

    return () => throttled();
  }, [operator]);

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
    if (!selected) return;

    if (!enterPress) return;

    if (!instances || !operator) return;

    operator.select(category);

    if (!operator.selection) return;

    dispatch(
      slice.actions.setImageInstances({
        instances: [...instances, operator.selection],
      })
    );

    operator.deselect();

    transformerRef.current?.detach();

    setSelected(false);
  }, [enterPress]);

  useEffect(() => {
    if (!selected) return;

    if (!escapePress) return;

    if (!operator) return;

    operator.deselect();

    transformerRef.current?.detach();
  }, [escapePress]);

  useEffect(() => {
    if (selection) {
      if (backspacePress || escapePress || deletePress) {
        dispatch(
          slice.actions.deleteImageInstance({
            id: selection,
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
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <ReactKonva.Image ref={imageRef} image={image} />

        {!selected && <Selection operation={operation} operator={operator} />}

        {selected && operator && operator.contour && (
          <React.Fragment>
            <ReactKonva.Line
              dash={[4, 2]}
              dashOffset={-dashOffset}
              points={operator.contour}
              ref={selectingRef}
              stroke="black"
              strokeWidth={1}
            />

            <ReactKonva.Line
              dash={[4, 2]}
              dashOffset={-dashOffset}
              points={operator.contour}
              stroke="white"
              strokeWidth={1}
            />
          </React.Fragment>
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
                  onClick={(event) => onClick(event, instance)}
                  opacity={0.5}
                  ref={selectionRef}
                  stroke={shadeHex(category.color, 50)}
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
