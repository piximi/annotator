import React, { useEffect, useState } from "react";
import * as ReactKonva from "react-konva";
import { useSelector } from "react-redux";
import { imageWidthSelector } from "../../../../../store/selectors/imageWidthSelector";
import { imageHeightSelector } from "../../../../../store/selectors/imageHeightSelector";
import {
  stageHeightSelector,
  stageWidthSelector,
  zoomToolOptionsSelector,
} from "../../../../../store/selectors";
import { offsetSelector } from "../../../../../store/selectors/offsetSelector";

type LayerProps = {
  children?: React.ReactNode;
};

export const Layer = ({ children }: LayerProps) => {
  const imageWidth = useSelector(imageWidthSelector);
  const imageHeight = useSelector(imageHeightSelector);

  const offset = useSelector(offsetSelector);

  const { automaticCentering } = useSelector(zoomToolOptionsSelector);

  const stageWidth = useSelector(stageWidthSelector);
  const stageHeight = useSelector(stageHeightSelector);

  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!imageWidth || !imageHeight) return;

    if (automaticCentering) {
      setPosition({
        x: (stageWidth - imageWidth) / 2,
        y: (stageHeight - imageHeight) / 2,
      });
    } else {
      setPosition({ x: stageWidth / 2, y: stageHeight / 2 });
    }
  }, [automaticCentering, stageWidth, stageHeight, imageWidth, imageHeight]);

  return (
    <ReactKonva.Layer
      imageSmoothingEnabled={false}
      offset={offset}
      position={position}
    >
      {children}
    </ReactKonva.Layer>
  );
};
