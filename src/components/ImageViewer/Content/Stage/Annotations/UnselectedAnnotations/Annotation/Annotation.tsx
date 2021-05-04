import React from "react";
import { CategoryType } from "../../../../../../../types/CategoryType";
import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import { AnnotationType } from "../../../../../../../types/AnnotationType";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  stageScaleSelector,
} from "../../../../../../../store/selectors";

type AnnotationProps = {
  annotation: AnnotationType;
};

export const Annotation = ({ annotation }: AnnotationProps) => {
  const categories = useSelector(categoriesSelector);
  const stageScale = useSelector(stageScaleSelector);

  const fill = _.find(
    categories,
    (category: CategoryType) => category.id === annotation.categoryId
  )?.color;

  if (!annotation || !annotation.contour) return <React.Fragment />;

  return (
    <ReactKonva.Group>
      <ReactKonva.Line
        closed
        points={annotation.contour}
        scale={{ x: stageScale, y: stageScale }}
        stroke="white"
        strokeWidth={1}
      />
      <ReactKonva.Line
        closed
        id={annotation.id}
        fill={fill}
        opacity={0.5}
        points={annotation.contour}
        scale={{ x: stageScale, y: stageScale }}
      />
    </ReactKonva.Group>
  );
};
