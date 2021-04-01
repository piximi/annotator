import * as ReactKonva from "react-konva";
import React from "react";
import useImage from "use-image";
import Konva from "konva";

type ImageProps = {
  height: number;
  src: string;
  width: number;
};

export const Image = React.forwardRef<Konva.Image, ImageProps>(
  ({ height, src, width }, ref) => {
    const [image] = useImage(src, "Anonymous");

    return (
      <ReactKonva.Image
        height={height}
        image={image}
        perfectDrawEnabled={false}
        ref={ref}
        width={width}
      />
    );
  }
);
