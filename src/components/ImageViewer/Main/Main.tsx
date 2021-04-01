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

export const Main = () => {
  const [image] = useImage(src);

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
        <ReactKonva.Layer position={position}>
          <Image height={imageH} width={imageW} />
        </ReactKonva.Layer>
      </ReactKonva.Stage>
    </main>
  );
};
