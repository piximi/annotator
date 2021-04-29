import React, { useEffect, useState } from "react";
import { AnnotationType } from "../../../../../../types/AnnotationType";
import { useSelector } from "react-redux";
import { visibleCategoriesSelector } from "../../../../../../store/selectors/visibleCategoriesSelector";
import { Annotation } from "../Annotation";
import { imageInstancesSelector } from "../../../../../../store/selectors";
import { AnnotationTool } from "../../../../../../image/Tool";
import { selectedAnnotationsSelector } from "../../../../../../store/selectors/selectedAnnotationsSelector";
import { selectedAnnotationsIdsSelector } from "../../../../../../store/selectors/selectedAnnotationsIdsSelector";

type AnnotationsProps = {
  annotationTool?: AnnotationTool;
};

export const Annotations = ({ annotationTool }: AnnotationsProps) => {
  const annotations = useSelector(imageInstancesSelector);

  const selectedAnnotationsIds = useSelector(selectedAnnotationsIdsSelector);

  const selectedAnnotations = useSelector(selectedAnnotationsSelector);

  const visibleCategories = useSelector(visibleCategoriesSelector);

  const [visibleAnnotations, setVisibleAnnotations] = useState<
    Array<AnnotationType>
  >([]);

  useEffect(() => {
    if (!annotations) return;

    const unselectedAnnotations = annotations.filter(
      (annotation: AnnotationType) => {
        return !selectedAnnotationsIds.includes(annotation.id);
      }
    );

    const updatedAnnotations = [
      ...unselectedAnnotations,
      ...selectedAnnotations,
    ];

    setVisibleAnnotations(
      updatedAnnotations.filter((annotation: AnnotationType) =>
        visibleCategories.includes(annotation.categoryId)
      )
    );
  }, [annotations, selectedAnnotations]);

  return (
    <React.Fragment>
      {visibleAnnotations.map((annotation: AnnotationType) => (
        <Annotation
          annotation={annotation}
          key={annotation.id}
          annotationTool={annotationTool}
        />
      ))}
    </React.Fragment>
  );
};
