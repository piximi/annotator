import { ObjectAnnotationTool } from "../../../../../../image/Tool";
import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../../hooks";

type ObjectSelectionProps = {
  operator: ObjectAnnotationTool;
};

export const ObjectSelection = ({ operator }: ObjectSelectionProps) => {
  const dashOffset = useMarchingAnts();

  if (!operator.origin || !operator.width || !operator.height) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Rect
        dash={[4, 2]}
        dashOffset={-dashOffset}
        height={operator.height}
        stroke="black"
        strokeWidth={1}
        width={operator.width}
        x={operator.origin.x}
        y={operator.origin.y}
      />

      <ReactKonva.Rect
        dash={[4, 2]}
        dashOffset={-dashOffset}
        height={operator.height}
        stroke="white"
        strokeWidth={1}
        width={operator.width}
        x={operator.origin.x}
        y={operator.origin.y}
      />

      <ReactKonva.Line
        stroke="white"
        points={operator.points}
        strokeWidth={1}
      />
    </ReactKonva.Group>
  );
};
