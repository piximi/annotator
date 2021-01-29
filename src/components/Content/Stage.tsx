import * as ReactKonva from "react-konva";
import Konva from "konva";
import React, { useRef, useState } from "react";
import useImage from "use-image";
import { useStyles } from "./Content.css";
import { SelectionOperator } from "../../image/selection";

type StageProps = {
  src: string;
};

export const Stage = ({ src }: StageProps) => {
  const [image] = useImage(src, "Anonymous");

  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const classes = useStyles();

  const [operator, setOperator] = useState<SelectionOperator>();

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
