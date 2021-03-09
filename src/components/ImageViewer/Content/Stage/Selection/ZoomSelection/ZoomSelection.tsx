import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../../hooks";
import { ZoomTool } from "../../../../../../image/Tool/ZoomTool";

type ZoomSelectionProps = {
  operator: ZoomTool;
};

export const ZoomSelection = ({ operator }: ZoomSelectionProps) => {
  const dashOffset = useMarchingAnts();

  if (!operator.minimum || !operator.maximum) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Rect
        dash={[4, 2]}
        dashOffset={-dashOffset}
        height={operator.maximum.y - operator.minimum.y}
        stroke="black"
        strokeWidth={1}
        width={operator.maximum.x - operator.minimum.x}
        x={operator.minimum.x}
        y={operator.minimum.y}
      />

      <ReactKonva.Rect
        dash={[4, 2]}
        dashOffset={-dashOffset}
        height={operator.maximum.y - operator.minimum.y}
        stroke="white"
        strokeWidth={1}
        width={operator.maximum.x - operator.minimum.x}
        x={operator.minimum.x}
        y={operator.minimum.y}
      />
    </ReactKonva.Group>
  );
};
