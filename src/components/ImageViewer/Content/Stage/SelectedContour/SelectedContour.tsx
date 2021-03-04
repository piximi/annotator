import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../hooks";

type SelectedContourProps = {
  points: Array<number>;
};

export const SelectedContour = ({ points }: SelectedContourProps) => {
  const dashOffset = useMarchingAnts();

  return (
    <React.Fragment>
      <ReactKonva.Line
        dash={[4, 2]}
        dashOffset={-dashOffset}
        points={points}
        stroke="black"
        strokeWidth={1}
      />

      <ReactKonva.Line
        dash={[4, 2]}
        dashOffset={-dashOffset}
        points={points}
        stroke="white"
        strokeWidth={1}
      />
    </React.Fragment>
  );
};
