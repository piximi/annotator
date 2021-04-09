import React, { useRef } from "react";
import { useStyles } from "./Main.css";
import * as ReactKonva from "react-konva";
import useImage from "use-image";
import src from "../../../../images/malaria.png";
import Konva from "konva";
import { useBoundingClientRect } from "../../../../hooks/useBoundingClientRect";
import { useSelector } from "react-redux";
import { stageScaleSelector } from "../../../../store/selectors";
import { Stage } from "../Stage";

type ImageProps = {
  height: number;
  width: number;
};

const Image = React.forwardRef<Konva.Image, ImageProps>(
  ({ height, width }, ref) => {
    const [image] = useImage(src);

    return (
      <ReactKonva.Image height={height} image={image} ref={ref} width={width} />
    );
  }
);

const CustomSelection = () => {
  const scale = useSelector(stageScaleSelector);

  return (
    <ReactKonva.Line
      dash={[4 / scale, 2 / scale]}
      stroke="black"
      strokeWidth={1 / scale}
      points={[
        135,
        200,
        135 + 100,
        200,
        135 + 100,
        200 + 95,
        135,
        200 + 95,
        135,
        200,
      ]}
      scale={{ x: scale, y: scale }}
    />
  );
};

export const Main = () => {
  const ref = useRef<HTMLDivElement>(null);

  const boundingClientRect = useBoundingClientRect(ref);

  const classes = useStyles();

  return (
    <main className={classes.content} ref={ref}>
      <Stage boundingClientRect={boundingClientRect} />
    </main>
  );
};
