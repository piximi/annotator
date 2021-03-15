import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../hooks";

type SelectedContourProps = {
  points: Array<number>;
  scale: number;
};

export const SelectedContour = ({ points, scale }: SelectedContourProps) => {
  const dashOffset = useMarchingAnts();

  return (
    <React.Fragment>
      <ReactKonva.Line
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        points={points}
        stroke="black"
        strokeWidth={1 / scale}
      />

      <ReactKonva.Line
        dash={[4 / scale, 2 / scale]}
        dashOffset={-dashOffset}
        points={points}
        stroke="white"
        strokeWidth={1 / scale}
      />
    </React.Fragment>
  );
};
