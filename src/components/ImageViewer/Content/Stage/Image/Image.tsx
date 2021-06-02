import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import useImage from "use-image";
import Konva from "konva";
import { useSelector } from "react-redux";
import { boundingClientRectSelector } from "../../../../../store/selectors";
import { scaledImageWidthSelector } from "../../../../../store/selectors/scaledImageWidthSelector";
import { scaledImageHeightSelector } from "../../../../../store/selectors/scaledImageHeightSelector";
import { imageSrcSelector } from "../../../../../store/selectors/imageSrcSelector";
import { channelsSelector } from "../../../../../store/selectors/intensityRangeSelector";
import { createIntensityFilter } from "../../../ToolOptions/ColorAdjustmentOptions/ColorAdjustmentOptions/ColorAdjustmentOptions";

export const Image = React.forwardRef<Konva.Image>((_, ref) => {
  const src = useSelector(imageSrcSelector);

  const width = useSelector(scaledImageWidthSelector);

  const height = useSelector(scaledImageHeightSelector);

  const [image] = useImage(src ? src : "", "Anonymous");

  const [cachedImage, setCachedImage] = useState<HTMLImageElement>();

  const [filters, setFilters] = useState<Array<any>>();

  const channels = useSelector(channelsSelector);

  const boundingClientRect = useSelector(boundingClientRectSelector);

  useEffect(() => {
    const IntensityFilter = createIntensityFilter(channels);
    setFilters([IntensityFilter]);
  }, [channels]);

  useEffect(() => {
    if (image) {
      setCachedImage(image);
    }
  }, [image]);

  if (!src) {
    return (
      <ReactKonva.Text
        x={boundingClientRect.x + 80}
        y={0.4 * boundingClientRect.height}
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
      filters={filters}
    />
  );
});
