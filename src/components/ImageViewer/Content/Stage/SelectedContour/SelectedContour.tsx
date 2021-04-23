import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../hooks";
import { useSelector } from "react-redux";
import { stageScaleSelector } from "../../../../../store/selectors";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";

type SelectedContourProps = {
  points: Array<number>;
};

export const SelectedContour = ({ points }: SelectedContourProps) => {
  const stageScale = useSelector(stageScaleSelector);

  const dashOffset = useMarchingAnts();

  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  return (
    <React.Fragment>
      <ReactKonva.Line
        dash={[4 / stageScale, 2 / stageScale]}
        dashOffset={-dashOffset}
        points={points}
        scale={{ x: stageScale, y: stageScale }}
        stroke="black"
        strokeWidth={1 / stageScale}
      />

      <ReactKonva.Line
        dash={[4 / stageScale, 2 / stageScale]}
        dashOffset={-dashOffset}
        points={points}
        scale={{ x: stageScale, y: stageScale }}
        stroke="white"
        strokeWidth={1 / stageScale}
      />

      <ReactKonva.Line
        dash={[4 / stageScale, 2 / stageScale]}
        dashOffset={-dashOffset}
        id={selectedAnnotation?.id}
        points={points.map((point: number) => {
          return point * stageScale;
        })}
        stroke="black"
        strokeWidth={1 / stageScale}
        viisble={false}
      />
    </React.Fragment>
  );
};
