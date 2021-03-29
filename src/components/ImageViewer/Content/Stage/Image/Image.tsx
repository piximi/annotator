import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import useImage from "use-image";
import Konva from "konva";

type ImageProps = {
  src: string;
  stageHeight: number;
  stageWidth: number;
};

export const Image = React.forwardRef<Konva.Image, ImageProps>(
  ({ src, stageHeight, stageWidth }, ref) => {
    const [image] = useImage(src, "Anonymous");

    const [height, setHeight] = useState<number>(stageHeight);
    const [width, setWidth] = useState<number>(stageWidth);

    useEffect(() => {
      if (!image) return;

      setWidth(stageWidth);
      setHeight(stageHeight * (image.height / image.width));
    });

    return (
      <ReactKonva.Image
        height={height}
        image={image}
        perfectDrawEnabled={false}
        position={{ x: 0, y: 0 }}
        ref={ref}
        width={width}
      />
    );
  }
);
