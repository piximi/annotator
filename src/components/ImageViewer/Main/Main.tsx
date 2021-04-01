import React, { useEffect, useRef, useState } from "react";
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

export const Main = () => {
  const ref = useRef<HTMLDivElement>(null);
  const boundingClientRect = useBoundingClientRect(ref);

  const stageRef = useRef<Konva.Stage>(null);

  const [scale, setScale] = useState(6);

  const [stageW, setStageW] = useState(1000);

  const stageH = 1000;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const imageW = 160 * scale;
  const imageH = 120 * scale;

  useEffect(() => {
    setPosition({
      x: (stageW - imageW) / 2,
      y: (stageH - imageH) / 2,
    });
  }, [stageW, stageH, imageW, imageH, scale]);

  /*
   * Change stage width on window resize
   */
  useEffect(() => {
    if (!boundingClientRect) return;

    setStageW(boundingClientRect.width);
  }, [boundingClientRect]);

  const classes = useStyles();

  return (
    <main className={classes.content} ref={ref}>
      <ReactKonva.Stage height={stageH} ref={stageRef} width={stageW}>
        <Layer height={imageH} position={position} width={imageW} />
      </ReactKonva.Stage>
    </main>
  );
};
