import * as ReactKonva from "react-konva";
import React from "react";
import { PenAnnotationTool } from "../../../../../../image/Tool";

type PenSelectionProps = {
  operator: PenAnnotationTool;
};

export const PenSelection = ({ operator }: PenSelectionProps) => {
  return (
    <ReactKonva.Group>
      <ReactKonva.Line
        points={operator.buffer}
        lineJoin="round"
        lineCap="round"
        stroke="red"
        strokeWidth={operator.brushSize}
      />
    </ReactKonva.Group>
  );
};
