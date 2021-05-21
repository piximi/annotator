import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import useImage from "use-image";
import Konva from "konva";
import { useSelector } from "react-redux";
import {
  boundingClientRectSelector,
  toolTypeSelector,
} from "../../../../../store/selectors";
import { scaledImageWidthSelector } from "../../../../../store/selectors/scaledImageWidthSelector";
import { scaledImageHeightSelector } from "../../../../../store/selectors/scaledImageHeightSelector";
import { imageSrcSelector } from "../../../../../store/selectors/imageSrcSelector";
import { ToolType } from "../../../../../types/ToolType";

export const Image = React.forwardRef<Konva.Image>((_, ref) => {
  const src = useSelector(imageSrcSelector);

  const width = useSelector(scaledImageWidthSelector);

  const height = useSelector(scaledImageHeightSelector);

  const [image] = useImage(src ? src : "", "Anonymous");

  const [cachedImage, setCachedImage] = useState<HTMLImageElement>();

  const boundingClientRect = useSelector(boundingClientRectSelector);

  useEffect(() => {
    if (image) {
      setCachedImage(image);
    }
  }, [image]);

  if (!src) {
    return (
      <ReactKonva.Text
        x={boundingClientRect.x + 80}
        y={boundingClientRect.height / 3}
        text={
          'To start annotating, drag and drop an image onto the canvas or click on "Open Image".'
        }
        fill={"white"}
        fontSize={30}
      />
    );
  }

  return (
    <ReactKonva.Image
      height={height}
      image={cachedImage}
      ref={ref}
      width={width}
    />
  );
});
