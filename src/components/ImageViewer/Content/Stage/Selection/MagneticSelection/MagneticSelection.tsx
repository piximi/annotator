import * as ReactKonva from "react-konva";
import React from "react";
import { MagneticAnnotationTool } from "../../../../../../image/Tool";
import { useMarchingAnts } from "../../../../../../hooks";

type MagneticSelectionProps = {
  operator: MagneticAnnotationTool;
};

export const MagneticSelection = ({ operator }: MagneticSelectionProps) => {
  const dashOffset = useMarchingAnts();

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
        points={operator.buffer}
        stroke="black"
        strokeWidth={1}
      />

      <ReactKonva.Line
        dash={[4, 2]}
        dashOffset={-dashOffset}
        stroke="white"
        points={operator.buffer}
        strokeWidth={1}
      />
    </ReactKonva.Group>
  );
};
