import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import useImage from "use-image";
import Konva from "konva";

type ImageProps = {
  position: { x: number; y: number };
  src: string;
  stageHeight: number;
  stageWidth: number;
};

export const Image = React.forwardRef<Konva.Image, ImageProps>(
  ({ position, src, stageHeight, stageWidth }, ref) => {
    const [image] = useImage(src, "Anonymous");

    return (
      <ReactKonva.Image
        height={stageHeight}
        image={image}
        perfectDrawEnabled={false}
        position={position}
        ref={ref}
        width={stageWidth}
      />
    );
  }
);
