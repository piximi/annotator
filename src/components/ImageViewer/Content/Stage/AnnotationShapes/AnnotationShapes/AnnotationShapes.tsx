import React, { useEffect, useState } from "react";
import { Selection } from "../../../../../../types/Selection";
import { useSelector } from "react-redux";
import { visibleCategoriesSelector } from "../../../../../../store/selectors/visibleCategoriesSelector";
import { AnnotationShape } from "../AnnotationShape";
import { imageInstancesSelector } from "../../../../../../store/selectors";
import { AnnotationTool } from "../../../../../../image/Tool/AnnotationTool/AnnotationTool";

type AnnotationShapesProps = {
  tool?: AnnotationTool;
};

export const AnnotationShapes = ({ tool }: AnnotationShapesProps) => {
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
          tool={tool}
        />
      ))}
    </React.Fragment>
  );
};
