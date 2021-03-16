import React, { useEffect, useState } from "react";
import { Selection } from "../../../../../../types/Selection";
import { useSelector } from "react-redux";
import { visibleCategoriesSelector } from "../../../../../../store/selectors/visibleCategoriesSelector";
import { AnnotationShape } from "../AnnotationShape";
import { imageInstancesSelector } from "../../../../../../store/selectors";
import { AnnotationTool } from "../../../../../../image/Tool";

type AnnotationShapesProps = {
  annotationTool?: AnnotationTool;
};

export const AnnotationShapes = ({ annotationTool }: AnnotationShapesProps) => {
  const annotations = useSelector(imageInstancesSelector);

  const visibleCategories = useSelector(visibleCategoriesSelector);

  const [visibleAnnotations, setVisibleAnnotations] = useState<
    Array<Selection>
  >([]);

  useEffect(() => {
    if (!annotations) return;

    setVisibleAnnotations(
      annotations.filter((annotation: Selection) =>
        visibleCategories.includes(annotation.categoryId)
      )
    );
  }, [annotations, visibleCategories]);

  return (
    <React.Fragment>
      {visibleAnnotations.map((annotation: Selection) => (
        <AnnotationShape
          annotation={annotation}
          key={annotation.id}
          annotationTool={annotationTool}
        />
      ))}
    </React.Fragment>
  );
};
