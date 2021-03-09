import * as ReactKonva from "react-konva";
import React from "react";
import { PenSelectionTool } from "../../../../../../image/Tool/SelectionTool/PenSelectionTool/PenSelectionOperator";

type PenSelectionProps = {
  operator: PenSelectionTool;
};

export const PenSelection = ({ operator }: PenSelectionProps) => {
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
