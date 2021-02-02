import { RectangularSelectionOperator } from "../../image/selection";
import * as ReactKonva from "react-konva";
import React from "react";

type RectangularSelectionProps = {
  operator: RectangularSelectionOperator;
};

export const RectangularSelection = ({
  operator,
}: RectangularSelectionProps) => {
  if (!operator.origin || !operator.width || !operator.height) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Rect
        height={operator.height}
        stroke="black"
        strokeWidth={1}
        width={operator.width}
        x={operator.origin.x}
        y={operator.origin.y}
      />

      <ReactKonva.Rect
        dash={[4, 2]}
        height={operator.height}
        stroke="white"
        strokeWidth={1}
        width={operator.width}
        x={operator.origin.x}
        y={operator.origin.y}
      />
    </ReactKonva.Group>
  );
};
