import React, { useEffect, useState } from "react";
import { Selection } from "../../../../../../types/Selection";
import { useSelector } from "react-redux";
import { visibleCategoriesSelector } from "../../../../../../store/selectors/visibleCategoriesSelector";
import { AnnotationShape } from "../AnnotationShape";

type AnnotationShapesProps = {
  annotations: Array<Selection>;
};

export const AnnotationShapes = ({ annotations }: AnnotationShapesProps) => {
  const visibleCategories = useSelector(visibleCategoriesSelector);

  const [visibleAnnotations, setVisibleAnnotations] = useState<
    Array<Selection>
  >([]);

  useEffect(() => {
    setVisibleAnnotations(
      annotations.filter((annotation: Selection) =>
        visibleCategories.includes(annotation.categoryId)
      )
    );
  }, [annotations, visibleCategories]);

  return (
    <React.Fragment>
      {visibleAnnotations.map((annotation: Selection) => (
        <AnnotationShape annotation={annotation} key={annotation.id} />
      ))}
    </React.Fragment>
  );
};
