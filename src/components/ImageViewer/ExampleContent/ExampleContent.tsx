import React, { useEffect, useRef, useState } from "react";
import { useStyles } from "./ExampleContent.css";
import * as ReactKonva from "react-konva";
import useImage from "use-image";
import src from "../../../images/malaria.png";
import Konva from "konva";
import { useBoundingClientRect } from "../../../hooks/useBoundingClientRect";

export const ExampleContent = () => {
  const [image] = useImage(src);

  const ref = useRef<HTMLDivElement>(null);
  const boundingClientRect = useBoundingClientRect(ref);

  const stageRef = useRef<Konva.Stage>(null);

  const [scale, setScale] = useState<number>(6);

  const [stageWidth, setStageWidth] = useState<number>(1000);
  const [stageHeight, setStageHeight] = useState<number>(1000);

  const [imageWidth, setImageWidth] = useState<number>(160 * scale);
  const [imageHeight, setImageHeight] = useState<number>(120 * scale);

  const [imageX, setImageX] = useState<number>(0);
  const [imageY, setImageY] = useState<number>(0);

  /*
   * Computes image position
   */
  useEffect(() => {
    setImageX((stageWidth - imageWidth) / 2);
    setImageY((stageHeight - imageHeight) / 2);
  }, [imageHeight, imageWidth, stageHeight, stageWidth]);

  /*
   * Change stage width on window resize
   */
  useEffect(() => {
    if (!boundingClientRect) return;

    setStageWidth(boundingClientRect.width);
  }, [boundingClientRect]);

  const classes = useStyles();

  return (
    <main className={classes.content} ref={ref}>
      <ReactKonva.Stage height={stageHeight} ref={stageRef} width={stageWidth}>
        <ReactKonva.Layer>
          <ReactKonva.Image
            height={imageHeight}
            image={image}
            width={imageWidth}
            x={imageX}
            y={imageY}
          />
        </ReactKonva.Layer>
      </ReactKonva.Stage>
    </main>
  );
};
