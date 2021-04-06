import * as ReactKonva from "react-konva";
import React from "react";
import useImage from "use-image";
import Konva from "konva";

type ImageProps = {
  height: number;
  position: { x: number; y: number };
  src: string;
  width: number;
};

export const Image = React.forwardRef<Konva.Image, ImageProps>(
  ({ height, position, src, width }, ref) => {
    const [image] = useImage(src, "Anonymous");

    return (
      <ReactKonva.Image
        height={height}
        image={image}
        perfectDrawEnabled={false}
        position={position}
        ref={ref}
        width={width}
      />
    );
  }
);
