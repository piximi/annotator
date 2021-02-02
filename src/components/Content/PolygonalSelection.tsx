import * as ReactKonva from "react-konva";
import React from "react";
import { PolygonalSelectionOperator } from "../../image/selection";

type PolygonalSelectionProps = {
  operator: PolygonalSelectionOperator;
};

export const PolygonalSelection = ({ operator }: PolygonalSelectionProps) => {
  if (!operator.origin) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Circle
        fill="white"
        radius={3}
        stroke="black"
        strokeWidth={1}
        x={operator.origin.x}
        y={operator.origin.y}
      />

      {operator.anchor && (
        <ReactKonva.Circle
          fill="black"
          radius={3}
          stroke="white"
          strokeWidth={1}
          x={operator.anchor.x}
          y={operator.anchor.y}
        />
      )}

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
