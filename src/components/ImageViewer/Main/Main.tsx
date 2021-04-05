import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStyles } from "./Main.css";
import * as ReactKonva from "react-konva";
import useImage from "use-image";
import src from "../../../images/malaria.png";
import Konva from "konva";
import { useBoundingClientRect } from "../../../hooks/useBoundingClientRect";
import { KonvaEventObject } from "konva/types/Node";

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

type LayerProps = {
  position: { x: number; y: number };
  children?: React.ReactNode;
};

const Layer = ({ children, position }: LayerProps) => {
  return <ReactKonva.Layer position={position}>{children}</ReactKonva.Layer>;
};

type StageProps = {
  boundingClientRect?: DOMRect;
};

const Stage = ({ boundingClientRect }: StageProps) => {
  const stageRef = useRef<Konva.Stage>(null);

  const imageRef = useRef<Konva.Image>(null);

  const [stageWidth, setStageWidth] = useState(1);

  const stageHeight = 1000;

  const [scale, setScale] = useState(1);

  const imageWidth = 1600 * scale;
  const imageHeight = 1200 * scale;

  // const [imageWidth, setImageWidth] = useState<number>(160);
  // const [imageHeight, setImageHeight] = useState<number>(120);

  const [automaticCentering, setAutomaticCentering] = useState<boolean>(false);

  /*
   * Fetch the image's dimensions from the image ref
   */
  useEffect(() => {
    if (!imageRef || !imageRef.current) return;

    // setImageWidth(imageWidth * scale);
    // setImageHeight(imageHeight * scale);
  }, [imageRef, scale]);

  /*
   * Dynamically resize the stage width to the container width
   */
  useEffect(() => {
    if (!boundingClientRect) return;

    setStageWidth(boundingClientRect.width);
  }, [boundingClientRect]);

  const layerPosition = useCallback(() => {
    return {
      x: (stageWidth - imageWidth) / 2,
      y: (stageHeight - imageHeight) / 2,
    };
  }, [stageWidth, stageHeight, imageWidth, imageHeight]);

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    if (!stageRef || !stageRef.current) return;

    // TODO: What do other applications use?
    const scaleBy = 1.25;

    setScale(event.evt.deltaY > 0 ? scale * scaleBy : scale / scaleBy);
  };

  // useEffect(() => {
  //   if (!imageRef || !imageRef.current) return;
  //
  //   console.info(imageRef.current.scale());
  // })

  return (
    <ReactKonva.Stage
      height={stageHeight}
      onWheel={onWheel}
      ref={stageRef}
      width={stageWidth}
    >
      <Layer position={layerPosition()}>
        <Image height={imageHeight} ref={imageRef} width={imageWidth} />

        <ReactKonva.Rect
          dash={[4, 2]}
          height={95 * scale}
          stroke="black"
          strokeWidth={1}
          width={100 * scale}
          x={135 * scale}
          y={200 * scale}
        />
      </Layer>
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
