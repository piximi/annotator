import { QuickSelectionOperator } from "../../../../../../image/selection";
import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";

type QuickSelectionProps = {
  operator: QuickSelectionOperator;
};

export const QuickSelection = ({ operator }: QuickSelectionProps) => {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    const image = new Image();
    image.src = operator.superpixelData;
    setImage(image);
  }, [operator.superpixelData]);

  if (!operator.superpixelData) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Image image={image} />
    </ReactKonva.Group>
  );
};
