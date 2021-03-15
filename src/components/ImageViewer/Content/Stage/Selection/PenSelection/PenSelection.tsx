import * as ReactKonva from "react-konva";
import React from "react";
import { PenAnnotationTool } from "../../../../../../image/Tool/AnnotationTool/PenAnnotationTool";

type PenSelectionProps = {
  operator: PenAnnotationTool;
  scale: number;
};

export const PenSelection = ({ operator, scale }: PenSelectionProps) => {
  return (
    <ReactKonva.Group>
      <ReactKonva.Line
        points={operator.buffer}
        stroke="red"
        strokeWidth={operator.brushSize}
      />
    </ReactKonva.Group>
  );
};
