import * as ReactKonva from "react-konva";
import React from "react";
import useImage from "use-image";
import Konva from "konva";
import { useSelector } from "react-redux";
import { imageSrcSelector } from "../../../../../store/selectors";
import { imageWidthSelector } from "../../../../../store/selectors/imageWidthSelector";
import { imageHeightSelector } from "../../../../../store/selectors/imageHeightSelector";

export const Image = React.forwardRef<Konva.Image>((_, ref) => {
  const src = useSelector(imageSrcSelector);

  const width = useSelector(imageWidthSelector);
  const height = useSelector(imageHeightSelector);

  const [image] = useImage(src ? src : "", "Anonymous");

  return (
    <ReactKonva.Image height={height} image={image} ref={ref} width={width} />
  );
});
