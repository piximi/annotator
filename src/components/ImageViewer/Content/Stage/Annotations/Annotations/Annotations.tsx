import React, { useEffect, useState } from "react";
import { AnnotationType } from "../../../../../../types/AnnotationType";
import { useSelector } from "react-redux";
import { visibleCategoriesSelector } from "../../../../../../store/selectors/visibleCategoriesSelector";
import { Annotation } from "../Annotation";
import { imageInstancesSelector } from "../../../../../../store/selectors";
import { AnnotationTool } from "../../../../../../image/Tool";

type AnnotationsProps = {
  annotationTool?: AnnotationTool;
};

export const Annotations = ({ annotationTool }: AnnotationsProps) => {
  const annotations = useSelector(imageInstancesSelector);

  const visibleCategories = useSelector(visibleCategoriesSelector);

  const [visibleAnnotations, setVisibleAnnotations] = useState<
    Array<AnnotationType>
  >([]);

  useEffect(() => {
    if (!annotations) return;

    setVisibleAnnotations(
      annotations.filter((annotation: AnnotationType) =>
        visibleCategories.includes(annotation.categoryId)
      )
    );
  }, [annotations, visibleCategories]);

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
