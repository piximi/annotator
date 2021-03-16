import * as ReactKonva from "react-konva";
import React from "react";
import useImage from "use-image";
import Konva from "konva";

type ImageProps = {
  src: string;
};

export const Image = React.forwardRef<Konva.Image, ImageProps>(
  ({ src }, ref) => {
    const [image] = useImage(src, "Anonymous");

    return (
      <ReactKonva.Image
        ref={ref}
        image={image}
        position={{ x: 0, y: 0 }}
        width={512}
        height={512}
      />
    );
  }
);
