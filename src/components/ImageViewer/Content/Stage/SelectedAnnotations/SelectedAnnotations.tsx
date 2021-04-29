import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { imageInstancesSelector } from "../../../../../store/selectors";
import { selectedAnnotationsIdsSelector } from "../../../../../store/selectors/selectedAnnotationsIdsSelector";
import { selectedAnnotationsSelector } from "../../../../../store/selectors/selectedAnnotationsSelector";
import { visibleCategoriesSelector } from "../../../../../store/selectors/visibleCategoriesSelector";
import { AnnotationType } from "../../../../../types/AnnotationType";
import { Annotation } from "../Annotations/Annotation";

export const SelectedAnnotations = () => {
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
        <Annotation annotation={annotation} key={annotation.id} />
      ))}
    </React.Fragment>
  );
};
