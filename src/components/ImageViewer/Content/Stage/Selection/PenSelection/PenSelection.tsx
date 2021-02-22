import * as ReactKonva from "react-konva";
import React from "react";
import { PenSelectionOperator } from "../../../../../../image/selection/PenSelectionOperator";

type PenSelectionProps = {
  operator: PenSelectionOperator;
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
