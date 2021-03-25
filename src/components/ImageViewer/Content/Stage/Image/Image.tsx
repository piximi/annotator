import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import useImage from "use-image";
import Konva from "konva";

type ImageProps = {
  src: string;
};

export const Image = React.forwardRef<Konva.Image, ImageProps>(
  ({ src }, ref) => {
    const [image] = useImage(src, "Anonymous");

    const [height, setHeight] = useState<number>(512);
    const [width, setWidth] = useState<number>(512);

    useEffect(() => {
      if (!image) return;

      setHeight(512 * (image.height / image.width));
    });

    return (
      <ReactKonva.Image
        height={height}
        image={image}
        position={{ x: 0, y: 0 }}
        ref={ref}
        width={width}
      />
    );
  }
);
