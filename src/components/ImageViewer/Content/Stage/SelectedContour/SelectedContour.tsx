import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../hooks";
import * as _ from "lodash";

type SelectedContourProps = {
  imagePosition: { x: number; y: number };
  points: Array<number>;
  scale: number;
  stageScale: { x: number; y: number };
};

export const SelectedContour = ({
  imagePosition,
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
        id="selected"
        points={points}
        stroke="black"
        strokeWidth={1 / scale}
        scaleX={stageScale.x}
        scaleY={stageScale.y}
        x={imagePosition.x}
        y={imagePosition.y}
      />

      <ReactKonva.Line
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        points={points}
        stroke="white"
        strokeWidth={1 / scale}
        scaleX={stageScale.x}
        scaleY={stageScale.y}
        x={imagePosition.x}
        y={imagePosition.y}
      />
    </React.Fragment>
  );
};
