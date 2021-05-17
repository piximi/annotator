import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../../hooks";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  stageScaleSelector,
} from "../../../../../../store/selectors";
import { selectedAnnotationSelector } from "../../../../../../store/selectors/selectedAnnotationSelector";
import * as _ from "lodash";
import { CategoryType } from "../../../../../../types/CategoryType";
import { AnnotationType } from "../../../../../../types/AnnotationType";
import { selectedAnnotationsSelector } from "../../../../../../store/selectors/selectedAnnotationsSelector";
import { SelectedAnnotation } from "../SelectedAnnotation/SelectedAnnotation";
import { Annotation } from "../ConfirmedAnnotations/Annotation";

export const SelectedAnnotations = () => {
  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  const selectedAnnotations = useSelector(selectedAnnotationsSelector);

  if (!selectedAnnotations || !selectedAnnotation) return <React.Fragment />;

  return (
    <React.Fragment>
      {selectedAnnotations.map((annotation: AnnotationType) => {
        return (
          <SelectedAnnotation key={annotation.id} annotation={annotation} />
        );
      })}
    </React.Fragment>
  );
};
