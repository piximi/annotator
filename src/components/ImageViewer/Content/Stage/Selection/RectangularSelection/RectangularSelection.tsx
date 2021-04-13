import { RectangularAnnotationTool } from "../../../../../../image/Tool";
import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../../hooks";
import { useSelector } from "react-redux";
import { stageScaleSelector } from "../../../../../../store/selectors";

type RectangularSelectionProps = {
  operator: RectangularAnnotationTool;
};

export const RectangularSelection = ({
  operator,
}: RectangularSelectionProps) => {
  const dashOffset = useMarchingAnts();

  const stageScale = useSelector(stageScaleSelector);

  if (!operator.origin || !operator.width || !operator.height) return null;

  const x = operator.origin.x * stageScale;
  const y = operator.origin.y * stageScale;

  return (
    <ReactKonva.Group>
      <ReactKonva.Rect
        dash={[4, 2]}
        dashOffset={-dashOffset}
        height={operator.height}
        scale={{ x: stageScale, y: stageScale }}
        stroke="black"
        strokeWidth={1}
        width={operator.width}
        x={x}
        y={y}
      />

      <ReactKonva.Rect
        dash={[4, 2]}
        dashOffset={-dashOffset}
        height={operator.height}
        scale={{ x: stageScale, y: stageScale }}
        stroke="white"
        strokeWidth={1}
        width={operator.width}
        x={x}
        y={y}
      />
    </ReactKonva.Group>
  );
};
