import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStyles } from "./Main.css";
import * as ReactKonva from "react-konva";
import useImage from "use-image";
import src from "../../../images/malaria.png";
import Konva from "konva";
import { useBoundingClientRect } from "../../../hooks/useBoundingClientRect";

type ImageProps = {
  height: number;
  width: number;
};

const Image = ({ height, width }: ImageProps) => {
  const [image] = useImage(src);

  return <ReactKonva.Image height={height} image={image} width={width} />;
};

type LayerProps = {
  height: number;
  position: { x: number; y: number };
  width: number;
};

const Layer = ({ height, position, width }: LayerProps) => {
  return (
    <ReactKonva.Layer position={position}>
      <Image height={height} width={width} />
    </ReactKonva.Layer>
  );
};

type StageProps = {
  boundingClientRect?: DOMRect;
};

const Stage = ({ boundingClientRect }: StageProps) => {
  const ref = useRef<Konva.Stage>(null);

  const [width, setWidth] = useState(1000);

  const height = 1000;

  const [scale, setScale] = useState(6);

  const imageWidth = 160 * scale;
  const imageHeight = 120 * scale;

  useEffect(() => {
    if (!boundingClientRect) return;

    setWidth(boundingClientRect.width);
  }, [boundingClientRect]);

  const position = useCallback(() => {
    return { x: (width - imageWidth) / 2, y: (height - imageHeight) / 2 };
  }, [width, height, imageWidth, imageHeight]);

  return (
    <ReactKonva.Stage height={height} ref={ref} width={width}>
      <Layer height={imageHeight} position={position()} width={imageWidth} />
    </ReactKonva.Stage>
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
