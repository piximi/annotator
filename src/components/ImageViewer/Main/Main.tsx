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
  const ref = useRef<Konva.Stage>(null);

  const imageRef = useRef<Konva.Image>(null);

  const [width, setWidth] = useState(1000);

  const height = 1000;

  const [scale, setScale] = useState(1);

  const [imageWidth, setImageWidth] = useState<number>(160);
  const [imageHeight, setImageHeight] = useState<number>(120);

  const [automaticCentering, setAutomaticCentering] = useState<boolean>(false);

  /*
   * Fetch the image's dimensions from the image ref
   */
  useEffect(() => {
    if (!imageRef || !imageRef.current) return;

    setImageWidth(imageRef.current.getWidth() * scale);
    setImageHeight(imageRef.current.getHeight() * scale);
  }, [imageRef, scale]);

  /*
   * Dynamically resize the stage width to the container width
   */
  useEffect(() => {
    if (!boundingClientRect) return;

    setWidth(boundingClientRect.width);
  }, [boundingClientRect]);

  const layerPosition = useCallback(() => {
    return { x: (width - imageWidth) / 2, y: (height - imageHeight) / 2 };
  }, [width, height, imageWidth, imageHeight]);

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    if (!ref || !ref.current) return;

    const previous = ref.current.scaleX();

    const scaleBy = 1.01;

    setScale(event.evt.deltaY > 0 ? previous * scaleBy : previous / scaleBy);
  };

  return (
    <ReactKonva.Stage height={height} onWheel={onWheel} ref={ref} width={width}>
      <Layer position={layerPosition()}>
        <Image height={imageHeight} ref={imageRef} width={imageWidth} />
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
