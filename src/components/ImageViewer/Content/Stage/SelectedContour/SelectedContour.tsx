import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../hooks";
import { useSelector } from "react-redux";
import { stageScaleSelector } from "../../../../../store/selectors";

type SelectedContourProps = {
  points: Array<number>;
};

export const SelectedContour = ({ points }: SelectedContourProps) => {
  const stageScale = useSelector(stageScaleSelector);
  const dashOffset = useMarchingAnts();

  return (
    <React.Fragment>
      <ReactKonva.Line
        dash={[4, 2]}
        dashOffset={-dashOffset}
        id="selected"
        points={points}
        scale={{ x: stageScale, y: stageScale }}
        stroke="black"
        strokeWidth={1}
      />

      <ReactKonva.Line
        dash={[4, 2]}
        dashOffset={-dashOffset}
        points={points}
        scale={{ x: stageScale, y: stageScale }}
        stroke="white"
        strokeWidth={1}
      />
    </React.Fragment>
  );
};
