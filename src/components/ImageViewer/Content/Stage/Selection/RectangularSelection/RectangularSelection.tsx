import { RectangularAnnotationTool } from "../../../../../../image/Tool/AnnotationTool";
import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../../hooks";

type RectangularSelectionProps = {
  operator: RectangularAnnotationTool;
};

export const RectangularSelection = ({
  operator,
}: RectangularSelectionProps) => {
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
    </ReactKonva.Group>
  );
};
