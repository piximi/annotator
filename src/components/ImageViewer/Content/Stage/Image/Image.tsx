import * as ReactKonva from "react-konva";
import React from "react";
import useImage from "use-image";
import Konva from "konva";
import { useSelector } from "react-redux";
import { imageSrcSelector } from "../../../../../store/selectors";

type ImageProps = {
  height: number;
  width: number;
};

export const Image = React.forwardRef<Konva.Image, ImageProps>(
  ({ height, width }, ref) => {
    const src = useSelector(imageSrcSelector);

    const [image] = useImage(src ? src : "", "Anonymous");

    return (
      <ReactKonva.Image height={height} image={image} ref={ref} width={width} />
    );
  }
);
