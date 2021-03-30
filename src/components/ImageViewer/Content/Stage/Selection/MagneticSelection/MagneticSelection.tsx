import * as ReactKonva from "react-konva";
import React from "react";
import { MagneticAnnotationTool } from "../../../../../../image/Tool";
import { useMarchingAnts } from "../../../../../../hooks";

type MagneticSelectionProps = {
  imagePosition: { x: number; y: number };
  operator: MagneticAnnotationTool;
  scale: number;
  stageScale: { x: number; y: number };
};

export const MagneticSelection = ({
  imagePosition,
  operator,
  scale,
  stageScale,
}: MagneticSelectionProps) => {
  const dashOffset = useMarchingAnts();

  if (!operator.origin) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Circle
        fill="white"
        radius={3 / scale}
        stroke="black"
        strokeWidth={1 / scale}
        x={operator.origin.x}
        y={operator.origin.y}
      />

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
        scale={stageScale}
        x={imagePosition.x}
        y={imagePosition.y}
      />

      <ReactKonva.Line
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        stroke="white"
        points={operator.buffer}
        strokeWidth={1 / scale}
        scale={stageScale}
        x={imagePosition.x}
        y={imagePosition.y}
      />
    </ReactKonva.Group>
  );
};
