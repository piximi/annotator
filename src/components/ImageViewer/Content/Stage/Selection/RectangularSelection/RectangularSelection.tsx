import { RectangularAnnotationTool } from "../../../../../../image/Tool/AnnotationTool";
import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../../hooks";

type RectangularSelectionProps = {
  operator: RectangularAnnotationTool;
  scale: number;
};

export const RectangularSelection = ({
  operator,
  scale,
}: RectangularSelectionProps) => {
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
    </ReactKonva.Group>
  );
};
