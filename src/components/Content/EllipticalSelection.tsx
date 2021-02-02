import { EllipticalSelectionOperator } from "../../image/selection";
import * as ReactKonva from "react-konva";
import React from "react";

type EllipticalSelectionProps = {
  operator: EllipticalSelectionOperator;
};

export const EllipticalSelection = ({ operator }: EllipticalSelectionProps) => {
  if (!operator.center || !operator.radius) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Ellipse
        radiusX={operator.radius.x}
        radiusY={operator.radius.y}
        stroke="black"
        strokeWidth={1}
        x={operator.center.x}
        y={operator.center.y}
      />

      <ReactKonva.Ellipse
        dash={[4, 2]}
        radiusX={operator.radius.x}
        radiusY={operator.radius.y}
        stroke="white"
        strokeWidth={1}
        x={operator.center.x}
        y={operator.center.y}
      />
    </ReactKonva.Group>
  );
};
