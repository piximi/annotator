import { EllipticalAnnotationTool } from "../../../../../../image/Tool";
import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../../hooks";
import { useSelector } from "react-redux";
import { stageScaleSelector } from "../../../../../../store/selectors";

type EllipticalSelectionProps = {
  operator: EllipticalAnnotationTool;
};

export const EllipticalSelection = ({ operator }: EllipticalSelectionProps) => {
  const dashOffset = useMarchingAnts();

  const stageScale = useSelector(stageScaleSelector);

  if (!operator.center || !operator.radius) return null;

  const x = operator.center.x * stageScale;
  const y = operator.center.y * stageScale;

  return (
    <ReactKonva.Group>
      <ReactKonva.Ellipse
        dash={[4, 2]}
        dashOffset={-dashOffset}
        radiusX={operator.radius.x}
        radiusY={operator.radius.y}
        scale={{ x: stageScale, y: stageScale }}
        stroke="black"
        strokeWidth={1}
        x={x}
        y={y}
      />

      <ReactKonva.Ellipse
        dash={[4, 2]}
        dashOffset={-dashOffset}
        radiusX={operator.radius.x}
        radiusY={operator.radius.y}
        scale={{ x: stageScale, y: stageScale }}
        stroke="white"
        strokeWidth={1}
        x={x}
        y={y}
      />
    </ReactKonva.Group>
  );
};
