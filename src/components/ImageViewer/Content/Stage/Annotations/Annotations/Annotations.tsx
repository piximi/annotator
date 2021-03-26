import React, { useEffect, useState } from "react";
import { Selection } from "../../../../../../types/Selection";
import { useSelector } from "react-redux";
import { visibleCategoriesSelector } from "../../../../../../store/selectors/visibleCategoriesSelector";
import { Annotation } from "../Annotation";
import { imageInstancesSelector } from "../../../../../../store/selectors";
import { AnnotationTool } from "../../../../../../image/Tool";

type AnnotationsProps = {
  annotationTool?: AnnotationTool;
  stageScale: { x: number; y: number };
};

export const Annotations = ({
  annotationTool,
  stageScale,
}: AnnotationsProps) => {
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
        <Annotation
          annotation={annotation}
          key={annotation.id}
          annotationTool={annotationTool}
          stageScale={stageScale}
        />
      ))}
    </React.Fragment>
  );
};
