import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import useImage from "use-image";
import Konva from "konva";
import { useSelector } from "react-redux";
import { toolTypeSelector } from "../../../../../store/selectors";
import { scaledImageWidthSelector } from "../../../../../store/selectors/scaledImageWidthSelector";
import { scaledImageHeightSelector } from "../../../../../store/selectors/scaledImageHeightSelector";
import { imageSrcSelector } from "../../../../../store/selectors/imageSrcSelector";
import { ToolType } from "../../../../../types/ToolType";

export const ImageComponent = React.forwardRef<Konva.Image>((_, ref) => {
  const src = useSelector(imageSrcSelector);

  const width = useSelector(scaledImageWidthSelector);
  const height = useSelector(scaledImageHeightSelector);

  const toolType = useSelector(toolTypeSelector);

  const [image] = useImage(src ? src : "", "Anonymous");

  const [adjustedImage, setAdjustedImage] = useState<HTMLImageElement>();

  useEffect(() => {
    if (!src) return;
    const image = new Image();
    image.src = src;
    setAdjustedImage(image);
  }, [src]);

  if (toolType !== ToolType.ColorAdjustment) {
    return (
      <ReactKonva.Image height={height} image={image} ref={ref} width={width} />
    );
  } else {
    //when adjusting color, we want to show the image at each render
    return (
      <ReactKonva.Image
        height={height}
        image={adjustedImage}
        ref={ref}
        width={width}
      />
    );
  }
});
