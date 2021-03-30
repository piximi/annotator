import * as ReactKonva from "react-konva";
import React from "react";
import useImage from "use-image";
import Konva from "konva";
import { useSelector } from "react-redux";
import {
  stageHeightSelector,
  stageWidthSelector,
} from "../../../../../store/selectors";

type ImageProps = {
  src: string;
};

export const Image = React.forwardRef<Konva.Image, ImageProps>(
  ({ src }, ref) => {
    const [image] = useImage(src, "Anonymous");

    const stageHeight = useSelector(stageHeightSelector);
    const stageWidth = useSelector(stageWidthSelector);

    const position = {
      x: 0,
      y: 0,
    };

    return (
      <ReactKonva.Image
        height={stageHeight}
        image={image}
        perfectDrawEnabled={false}
        absolutePosition={position}
        ref={ref}
        width={stageWidth}
      />
    );
  }
);
