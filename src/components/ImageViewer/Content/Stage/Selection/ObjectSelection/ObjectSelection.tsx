import { ObjectAnnotationTool } from "../../../../../../image/Tool";
import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../../hooks";

type ObjectSelectionProps = {
  operator: ObjectAnnotationTool;
  scale: number;
};

export const ObjectSelection = ({ operator, scale }: ObjectSelectionProps) => {
  const dashOffset = useMarchingAnts();

  if (!operator.origin || !operator.width || !operator.height) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Rect
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        height={operator.height}
        stroke="black"
        strokeWidth={1 / scale}
        width={operator.width}
        x={operator.origin.x}
        y={operator.origin.y}
      />

      <ReactKonva.Rect
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        height={operator.height}
        stroke="white"
        strokeWidth={1 / scale}
        width={operator.width}
        x={operator.origin.x}
        y={operator.origin.y}
      />

      <ReactKonva.Line
        stroke="white"
        points={operator.points}
        strokeWidth={1 / scale}
      />
    </ReactKonva.Group>
  );
};
