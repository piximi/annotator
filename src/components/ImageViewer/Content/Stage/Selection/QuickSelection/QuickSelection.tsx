import { QuickAnnotationTool } from "../../../../../../image/Tool";
import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";

type QuickSelectionProps = {
  operator: QuickAnnotationTool;
};

export const QuickSelection = ({ operator }: QuickSelectionProps) => {
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
      <ReactKonva.Image image={image} />
    </ReactKonva.Group>
  );
};
