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
import { imageViewerOperationSelector } from "../../../../../store/selectors";
import { useSelector } from "react-redux";
import { useStyles } from "../../Content/Content.css";
import * as ImageJS from "image-js";
import { Selection } from "../Selection";

type StageProps = {
  src: string;
};

export const Stage = ({ src }: StageProps) => {
  const [image] = useImage(src, "Anonymous");

  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const classes = useStyles();

  const operation = useSelector(imageViewerOperationSelector);

  const [operator, setOperator] = useState<SelectionOperator>();

  const [, update] = useReducer((x) => x + 1, 0);

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

        <Selection operation={operation} operator={operator} />
      </ReactKonva.Layer>
    </ReactKonva.Stage>
  );
};
