import React, { useEffect, useState } from "react";
import { AnnotationType } from "../../../../../../types/AnnotationType";
import { useSelector } from "react-redux";
import { visibleCategoriesSelector } from "../../../../../../store/selectors/visibleCategoriesSelector";
import { Annotation } from "../Annotation";
import { imageInstancesSelector } from "../../../../../../store/selectors";
import { newAnnotationSelector } from "../../../../../../store/selectors/newAnnotationSelector";
import { selectedAnnotationSelector } from "../../../../../../store/selectors/selectedAnnotationSelector";

export const Annotations = () => {
  const annotations = useSelector(imageInstancesSelector);

  const newAnnotation = useSelector(newAnnotationSelector);

  const visibleCategories = useSelector(visibleCategoriesSelector);

  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  const [visibleAnnotations, setVisibleAnnotations] = useState<
    Array<AnnotationType>
  >([]);

  //   //FIXME bring back visible annotations

  // useEffect(() => {
  //   if (!annotations) return;
  //
  //   //FIXME bring back visible annotations
  //   setVisibleAnnotations(
  //     annotations.filter((annotation: AnnotationType) =>
  //       visibleCategories.includes(annotation.categoryId)
  //     )
  //   );
  // }, [annotations, visibleCategories]);

  if (!annotations) return <React.Fragment />;

  return (
    <React.Fragment>
      {annotations.map((annotation: AnnotationType) => (
        <Annotation annotation={annotation} key={annotation.id} />
      ))}
      {selectedAnnotation && (
        <Annotation
          annotation={selectedAnnotation}
          key={selectedAnnotation.id}
        />
      )}
    </React.Fragment>
  );
};
