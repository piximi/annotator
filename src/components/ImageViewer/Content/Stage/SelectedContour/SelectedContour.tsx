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

  const stagedPoints: Array<number> = _.flatten(
    _.map(_.chunk(points, 2), (coords: Array<number>) => {
      return [
        coords[0] + imagePosition.x / stageScale.x,
        coords[1] + imagePosition.y / stageScale.y,
      ];
    })
  );

  return (
    <React.Fragment>
      <ReactKonva.Line
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        id="selected"
        points={stagedPoints}
        stroke="black"
        strokeWidth={1 / scale}
        scaleX={stageScale.x}
        scaleY={stageScale.y}
      />

      <ReactKonva.Line
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        points={stagedPoints}
        stroke="white"
        strokeWidth={1 / scale}
        scaleX={stageScale.x}
        scaleY={stageScale.y}
      />
    </React.Fragment>
  );
};
