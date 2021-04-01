import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../hooks";
import * as _ from "lodash";

type SelectedContourProps = {
  imagePosition: { x: number; y: number };
  points: Array<number>;
};

export const SelectedContour = ({
  imagePosition,
  points,
}: SelectedContourProps) => {
  const dashOffset = useMarchingAnts();

  return (
    <React.Fragment>
      <ReactKonva.Line
        dash={[4, 2]}
        dashOffset={-dashOffset}
        id="selected"
        points={points}
        stroke="black"
        strokeWidth={1}
        x={imagePosition.x}
        y={imagePosition.y}
      />

      <ReactKonva.Line
        dash={[4, 2]}
        dashOffset={-dashOffset}
        points={points}
        stroke="white"
        strokeWidth={1}
        x={imagePosition.x}
        y={imagePosition.y}
      />
    </React.Fragment>
  );
};
