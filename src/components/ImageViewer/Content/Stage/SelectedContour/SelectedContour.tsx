import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../hooks";

type SelectedContourProps = {
  points: Array<number>;
  scale: number;
  stageScale: { x: number; y: number };
};

export const SelectedContour = ({
  points,
  scale,
  stageScale,
}: SelectedContourProps) => {
  const dashOffset = useMarchingAnts();

  if (!stageScale) return <React.Fragment />;

  return (
    <React.Fragment>
      <ReactKonva.Line
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        points={points}
        stroke="black"
        strokeWidth={1 / scale}
        scaleX={stageScale.x}
        scaleY={stageScale.y}
      />

      <ReactKonva.Line
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        points={points}
        stroke="white"
        strokeWidth={1 / scale}
        scaleX={stageScale.x}
        scaleY={stageScale.y}
      />
    </React.Fragment>
  );
};
