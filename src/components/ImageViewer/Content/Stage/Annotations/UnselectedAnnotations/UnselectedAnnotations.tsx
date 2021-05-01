import React, { useEffect, useState } from "react";
import { AnnotationType } from "../../../../../../types/AnnotationType";
import { useSelector } from "react-redux";
import { visibleCategoriesSelector } from "../../../../../../store/selectors/visibleCategoriesSelector";
import { Annotation } from "./Annotation";
import { imageInstancesSelector } from "../../../../../../store/selectors";
import { selectedAnnotationsSelector } from "../../../../../../store/selectors/selectedAnnotationsSelector";
import { selectedAnnotationsIdsSelector } from "../../../../../../store/selectors/selectedAnnotationsIdsSelector";

export const UnselectedAnnotations = () => {
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

    setVisibleAnnotations(
      unselectedAnnotations.filter((annotation: AnnotationType) =>
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
