import { QuickAnnotationTool } from "../../../../../../image/Tool";
import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";

type QuickSelectionProps = {
  imagePosition: { x: number; y: number };
  operator: QuickAnnotationTool;
};

export const QuickSelection = ({
  imagePosition,
  operator,
}: QuickSelectionProps) => {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    if (!operator.currentMask) return;

    const image = new Image();
    image.src = operator.currentMask.toDataURL();
    setImage(image);
  }, [operator.currentMask]);

  if (!operator.currentMask) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Image image={image} x={imagePosition.x} y={imagePosition.y} />
    </ReactKonva.Group>
  );
};
