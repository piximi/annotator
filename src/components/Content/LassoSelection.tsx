import * as ReactKonva from "react-konva";
import React from "react";
import { LassoSelectionOperator } from "../../image/selection";

type LassoSelectionProps = {
  operator: LassoSelectionOperator;
};

export const LassoSelection = ({ operator }: LassoSelectionProps) => {
  if (!operator.origin) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Circle
        fill="black"
        globalCompositeOperation="source-over"
        radius={3}
        stroke="white"
        strokeWidth={1}
        x={operator.origin.x}
        y={operator.origin.y}
      />

      <ReactKonva.Line
        stroke="white"
        points={operator.buffer}
        strokeWidth={1}
      />

      <ReactKonva.Rect
        dash={[4, 2]}
        points={operator.buffer}
        stroke="white"
        strokeWidth={1}
      />
    </ReactKonva.Group>
  );
};
