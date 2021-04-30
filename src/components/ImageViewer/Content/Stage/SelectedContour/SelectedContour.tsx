import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import { useMarchingAnts } from "../../../../../hooks";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  stageScaleSelector,
} from "../../../../../store/selectors";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";
import * as _ from "lodash";
import { CategoryType } from "../../../../../types/CategoryType";
import { AnnotationType } from "../../../../../types/AnnotationType";
import { selectedAnnotationsSelector } from "../../../../../store/selectors/selectedAnnotationsSelector";
import { scaledSelectedAnnotationContourSelector } from "../../../../../store/selectors/scaledSelectedAnnotationContourSelector";

export const SelectedContour = () => {
  const stageScale = useSelector(stageScaleSelector);

  const dashOffset = useMarchingAnts();

  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  const categories = useSelector(categoriesSelector);

  const selectedAnnotations = useSelector(selectedAnnotationsSelector);

  const [scaledContour, setScaledContour] = useState<Array<number>>([]);

  // FIXME The problem here is that when the contour of selectedAnnotation is updated at the end of a transform, its new contour is dispatch
  // then this use effect is activated and the scaled contour is scaled once again (too much) and then the transform attaches to that one.
  useEffect(() => {
    if (!selectedAnnotation) return;
    setScaledContour(
      selectedAnnotation.contour.map((point: number) => {
        return point * stageScale;
      })
    );
  }, [stageScale, selectedAnnotation, selectedAnnotation?.contour]); //.contour is needed

  if (!selectedAnnotation || !selectedAnnotation.contour)
    return <React.Fragment />;

  const fill = _.find(
    categories,
    (category: CategoryType) => category.id === selectedAnnotation.categoryId
  )?.color;

  if (!selectedAnnotations || !scaledContour) return <React.Fragment />;

  return (
    <React.Fragment>
      {selectedAnnotations.map((annotation: AnnotationType) => {
        return (
          <React.Fragment key={annotation.id}>
            <ReactKonva.Line
              closed
              dash={[4 / stageScale, 2 / stageScale]}
              dashOffset={-dashOffset}
              fill={fill}
              opacity={0.5}
              points={annotation.contour}
              scale={{ x: stageScale, y: stageScale }}
              stroke="black"
              strokeWidth={1 / stageScale}
            />

            <ReactKonva.Line
              dash={[4 / stageScale, 2 / stageScale]}
              dashOffset={-dashOffset}
              points={annotation.contour}
              scale={{ x: stageScale, y: stageScale }}
              stroke="white"
              strokeWidth={1 / stageScale}
            />

            <ReactKonva.Line
              dash={[4 / stageScale, 2 / stageScale]}
              dashOffset={-dashOffset}
              id={annotation.id}
              points={scaledContour}
              stroke="blue"
              strokeWidth={1 / stageScale}
              viisble={false}
            />
          </React.Fragment>
        );
      })}
    </React.Fragment>
    // <React.Fragment>
    //   <ReactKonva.Line
    //     closed
    //     dash={[4 / stageScale, 2 / stageScale]}
    //     dashOffset={-dashOffset}
    //     fill={fill}
    //     opacity={0.5}
    //     points={selectedAnnotation.contour}
    //     scale={{ x: stageScale, y: stageScale }}
    //     stroke="black"
    //     strokeWidth={1 / stageScale}
    //   />
    //
    //   <ReactKonva.Line
    //     dash={[4 / stageScale, 2 / stageScale]}
    //     dashOffset={-dashOffset}
    //     points={selectedAnnotation.contour}
    //     scale={{ x: stageScale, y: stageScale }}
    //     stroke="white"
    //     strokeWidth={1 / stageScale}
    //   />
    //
    //   <ReactKonva.Line
    //     dash={[4 / stageScale, 2 / stageScale]}
    //     dashOffset={-dashOffset}
    //     id={selectedAnnotation?.id}
    //     points={scaledContour}
    //     stroke="blue"
    //     strokeWidth={1 / stageScale}
    //     viisble={false}
    //   />
    // </React.Fragment>
  );
};
