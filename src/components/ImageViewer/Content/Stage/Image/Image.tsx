import * as ReactKonva from "react-konva";
import React from "react";
import useImage from "use-image";
import Konva from "konva";
import { useSelector } from "react-redux";
import { imageSrcSelector } from "../../../../../store/selectors";
import { scaledImageWidthSelector } from "../../../../../store/selectors/scaledImageWidthSelector";
import { scaledImageHeightSelector } from "../../../../../store/selectors/scaledImageHeightSelector";

export const Image = React.forwardRef<Konva.Image>((_, ref) => {
  const src = useSelector(imageSrcSelector);

  const width = useSelector(scaledImageWidthSelector);
  const height = useSelector(scaledImageHeightSelector);

  const [image] = useImage(src ? src : "", "Anonymous");

  return (
    <ReactKonva.Image height={height} image={image} ref={ref} width={width} />
  );
});
