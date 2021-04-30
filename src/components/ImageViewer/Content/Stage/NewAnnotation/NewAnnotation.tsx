import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import { useMarchingAnts } from "../../../../../hooks";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  stageScaleSelector,
} from "../../../../../store/selectors";
import * as _ from "lodash";
import { CategoryType } from "../../../../../types/CategoryType";
import { AnnotationType } from "../../../../../types/AnnotationType";
import { newAnnotationSelector } from "../../../../../store/selectors/newAnnotationSelector";

export const NewAnnotation = () => {
  const stageScale = useSelector(stageScaleSelector);

  const dashOffset = useMarchingAnts();

  const [scaledContour, setScaledContour] = useState<Array<number>>([]);

  const categories = useSelector(categoriesSelector);

  const newAnnotation = useSelector(newAnnotationSelector);

  useEffect(() => {
    if (!newAnnotation || !newAnnotation.contour) return;

    setScaledContour(
      newAnnotation.contour.map((point: number) => {
        return point * stageScale;
      })
    );
  }, [stageScale]);

  useEffect(() => {
    if (!newAnnotation) return;
    setScaledContour(
      newAnnotation.contour.map((point: number) => {
        return point * stageScale;
      })
    );
  }, [newAnnotation?.id]);

  if (!newAnnotation) return <React.Fragment />;

  const fill = _.find(
    categories,
    (category: CategoryType) => category.id === newAnnotation.categoryId
  )?.color;

  if (!newAnnotation || !newAnnotation.contour) return <React.Fragment />;

  return (
    <React.Fragment>
      <ReactKonva.Line
        closed
        dash={[4 / stageScale, 2 / stageScale]}
        dashOffset={-dashOffset}
        fill={fill}
        opacity={0.5}
        points={newAnnotation.contour}
        scale={{ x: stageScale, y: stageScale }}
        stroke="black"
        strokeWidth={1 / stageScale}
      />

      <ReactKonva.Line
        dash={[4 / stageScale, 2 / stageScale]}
        dashOffset={-dashOffset}
        points={newAnnotation.contour}
        scale={{ x: stageScale, y: stageScale }}
        stroke="white"
        strokeWidth={1 / stageScale}
      />

      <ReactKonva.Line
        dash={[4 / stageScale, 2 / stageScale]}
        dashOffset={-dashOffset}
        id={newAnnotation?.id}
        points={scaledContour}
        stroke="blue"
        strokeWidth={1 / stageScale}
        viisble={false}
      />
    </React.Fragment>
  );
};
