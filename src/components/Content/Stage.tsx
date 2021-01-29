import * as ReactKonva from "react-konva";
import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import useImage from "use-image";
import { useStyles } from "./Content.css";
import {
  EllipticalSelectionOperator,
  LassoSelectionOperator,
  PolygonalSelectionOperator,
  RectangularSelectionOperator,
  SelectionOperator,
} from "../../image/selection";
import { useSelector } from "react-redux";
import { imageViewerOperationSelector } from "../../store/selectors";
import { ImageViewerOperation } from "../../types/ImageViewerOperation";

type StageProps = {
  src: string;
};

export const Stage = ({ src }: StageProps) => {
  const [image] = useImage(src, "Anonymous");

  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const classes = useStyles();

  const operation = useSelector(imageViewerOperationSelector);

  const [operator, setOperator] = useState<SelectionOperator>(
    new RectangularSelectionOperator()
  );

  useEffect(() => {
    switch (operation) {
      case ImageViewerOperation.EllipticalSelection:
        setOperator(new EllipticalSelectionOperator());

        return;
      case ImageViewerOperation.LassoSelection:
        setOperator(new LassoSelectionOperator());

        return;
      case ImageViewerOperation.PolygonalSelection:
        setOperator(new PolygonalSelectionOperator());

        return;
      case ImageViewerOperation.RectangularSelection:
        setOperator(new RectangularSelectionOperator());

        return;
    }
  }, [operation]);

  const onMouseDown = () => {};
  const onMouseMove = () => {};
  const onMouseUp = () => {};

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
      </ReactKonva.Layer>
    </ReactKonva.Stage>
  );
};
