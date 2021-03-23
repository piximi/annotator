import { EllipticalAnnotationTool } from "../../../../../../image/Tool";
import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../../hooks";

type EllipticalSelectionProps = {
  operator: EllipticalAnnotationTool;
  scale: number;
};

export const EllipticalSelection = ({
  operator,
  scale,
}: EllipticalSelectionProps) => {
  const dashOffset = useMarchingAnts();

  if (!operator.center || !operator.radius) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Ellipse
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        radiusX={operator.radius.x}
        radiusY={operator.radius.y}
        stroke="black"
        strokeWidth={1 / scale}
        x={operator.center.x}
        y={operator.center.y}
      />

      <ReactKonva.Ellipse
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        radiusX={operator.radius.x}
        radiusY={operator.radius.y}
        stroke="white"
        strokeWidth={1 / scale}
        x={operator.center.x}
        y={operator.center.y}
      />
    </ReactKonva.Group>
  );
};
