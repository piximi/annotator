import { ColorSelectionTool } from "../../../../../../image/Tool/SelectionTool";
import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";

type ColorSelectionProps = {
  operator: ColorSelectionTool;
};

export const ColorSelection = ({ operator }: ColorSelectionProps) => {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    const image = new Image();
    image.src = operator.overlayData;
    setImage(image);
  }, [operator.overlayData]);

  if (!operator.overlayData || !operator.offset) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Image
        image={image}
        x={operator.offset.x}
        y={operator.offset.y}
      />
    </ReactKonva.Group>
  );
};
