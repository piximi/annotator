import * as ReactKonva from "react-konva";
import React from "react";
import { LassoAnnotationTool } from "../../../../../../image/Tool";
import { useMarchingAnts } from "../../../../../../hooks";

type LassoSelectionProps = {
  operator: LassoAnnotationTool;
  scale: number;
};

export const LassoSelection = ({ operator, scale }: LassoSelectionProps) => {
  const dashOffset = useMarchingAnts();

  return (
    <ReactKonva.Group>
      {operator.origin && (
        <ReactKonva.Circle
          fill="white"
          radius={3 / scale}
          stroke="black"
          strokeWidth={1 / scale}
          x={operator.origin.x}
          y={operator.origin.y}
        />
      )}

      {operator.anchor && (
        <ReactKonva.Circle
          fill="black"
          radius={3 / scale}
          stroke="white"
          strokeWidth={1 / scale}
          x={operator.anchor.x}
          y={operator.anchor.y}
        />
      )}

      <ReactKonva.Line
        points={operator.buffer}
        stroke="black"
        strokeWidth={1 / scale}
      />

      <ReactKonva.Line
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        stroke="white"
        points={operator.buffer}
        strokeWidth={1 / scale}
      />
    </ReactKonva.Group>
  );
};
