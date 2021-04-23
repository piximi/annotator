import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import { useMarchingAnts } from "../../../../../hooks";
import { useSelector } from "react-redux";
import { stageScaleSelector } from "../../../../../store/selectors";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";

export const SelectedContour = () => {
  const stageScale = useSelector(stageScaleSelector);

  const dashOffset = useMarchingAnts();

  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  const [scaledContour, setScaledContour] = useState<Array<number>>([]);

  useEffect(() => {
    if (!selectedAnnotation) return;

    setScaledContour(
      selectedAnnotation.contour.map((point: number) => {
        return point * stageScale;
      })
    );
  }, [stageScale, selectedAnnotation, selectedAnnotation?.contour]);

  if (!selectedAnnotation || !selectedAnnotation.contour)
    return <React.Fragment />;

  return (
    <React.Fragment>
      <ReactKonva.Line
        dash={[4 / stageScale, 2 / stageScale]}
        dashOffset={-dashOffset}
        points={selectedAnnotation.contour}
        scale={{ x: stageScale, y: stageScale }}
        stroke="black"
        strokeWidth={1 / stageScale}
      />

      <ReactKonva.Line
        dash={[4 / stageScale, 2 / stageScale]}
        dashOffset={-dashOffset}
        points={selectedAnnotation.contour}
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
