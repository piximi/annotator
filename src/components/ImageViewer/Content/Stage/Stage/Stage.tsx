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
import { ImageViewerOperation } from "../../../../../types/ImageViewerOperation";
import {
  imageViewerImageInstancesSelector,
  imageViewerOperationSelector,
} from "../../../../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useStyles } from "../../Content/Content.css";
import * as ImageJS from "image-js";
import { Selection } from "../Selection";
import { Category } from "../../../../../types/Category";
import { imageViewerSlice } from "../../../../../store/slices";
import { useKeyPress } from "../../../../../hooks/useKeyPress/useKeyPress";
import { Instance } from "../../../../../types/Instance";
import { shadeHex } from "../../../../../image/shade";
import { useMarchingAnts } from "../../../../../hooks";

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

  const operation = useSelector(imageViewerOperationSelector);

  const [operator, setOperator] = useState<SelectionOperator>();

  const [selection, setSelection] = useState<string>();
  const [selected, setSelected] = useState<boolean>(false);

  const [, update] = useReducer((x) => x + 1, 0);

  const dispatch = useDispatch();

  const instances = useSelector(imageViewerImageInstancesSelector);

  const enterPress = useKeyPress("Enter");
  const escapePress = useKeyPress("Escape");

  const dashOffset = useMarchingAnts();

  useEffect(() => {
    ImageJS.Image.load(src).then((image: ImageJS.Image) => {
      switch (operation) {
        case ImageViewerOperation.ColorSelection:
          setOperator(new ColorSelectionOperator(image));

          return;
        case ImageViewerOperation.EllipticalSelection:
          setOperator(new EllipticalSelectionOperator(image));

          return;
        case ImageViewerOperation.LassoSelection:
          setOperator(new LassoSelectionOperator(image));

          return;
        case ImageViewerOperation.MagneticSelection:
          setOperator(new MagneticSelectionOperator(image));

          return;
        case ImageViewerOperation.ObjectSelection:
          ObjectSelectionOperator.compile(image).then(
            (operator: ObjectSelectionOperator) => {
              setOperator(operator);
            }
          );

          return;
        case ImageViewerOperation.PolygonalSelection:
          setOperator(new PolygonalSelectionOperator(image));

          return;
        case ImageViewerOperation.QuickSelection:
          setOperator(new QuickSelectionOperator(image));

          return;
        case ImageViewerOperation.RectangularSelection:
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
    instance: Instance
  ) => {
    if (operator) operator.deselect();

    setSelection(instance.id);

    selectionRef.current = event.target as Konva.Line;
    console.log(selectionRef);
    console.log(selection);
    console.log(event);
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
      imageViewerSlice.actions.setImageViewerImageInstances({
        instances: [...instances, operator.selection],
      })
    );

    operator.deselect();

    transformerRef.current?.detach();

    selectingRef.current = null;
    transformerRef.current = null;
    setSelected(false);
    console.log(selectingRef);
    console.log(transformerRef);
  }, [enterPress]);
  //
  // useEffect(() => {
  //   if (!escapePress) return;
  //
  //   if (!operator) return;
  //
  //   operator.deselect();
  // }, [escapePress]);

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
          instances.map((instance: Instance) => {
            return (
              <ReactKonva.Line
                closed={true}
                key={instance.id}
                points={instance.contour}
                fill={category.color}
                onClick={(event) => onClick(event, instance)}
                opacity={0.5}
                ref={selectionRef}
                stroke={shadeHex(category.color, 50)}
                strokeWidth={1}
              />
            );
          })}

        <ReactKonva.Transformer ref={transformerRef} />
      </ReactKonva.Layer>
    </ReactKonva.Stage>
  );
};
