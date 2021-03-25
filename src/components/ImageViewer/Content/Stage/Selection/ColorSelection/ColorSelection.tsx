import { ColorAnnotationTool } from "../../../../../../image/Tool";
import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";

type ColorSelectionProps = {
  operator: ColorAnnotationTool;
  stageScale: { x: number; y: number };
};

export const ColorSelection = ({
  operator,
  stageScale,
}: ColorSelectionProps) => {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    const image = new Image();
    image.src = operator.overlayData;
    setImage(image);
    console.info(image.width);
    console.info(image.height);
  }, [operator.overlayData]);

  if (!operator.overlayData || !operator.offset) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Image
        image={image}
        x={operator.offset.x}
        y={operator.offset.y}
        scaleX={stageScale.x}
        scaleY={stageScale.y}
      />
    </ReactKonva.Group>
  );
};
