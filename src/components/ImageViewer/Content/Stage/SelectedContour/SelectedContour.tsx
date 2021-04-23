import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
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

  const [scaledContour, setScaledContour] = useState<Array<number>>([]);

  useEffect(() => {
    if (!points) return;
    setScaledContour(
      points.map((point: number) => {
        return point * stageScale;
      })
    );
  }, [stageScale, points]);

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
        points={scaledContour}
        stroke="blue"
        strokeWidth={1 / stageScale}
        viisble={false}
      />
    </React.Fragment>
  );
};
