import React, { useEffect, useState } from "react";
import { Selection } from "../../../../../../types/Selection";
import { useSelector } from "react-redux";
import { visibleCategoriesSelector } from "../../../../../../store/selectors/visibleCategoriesSelector";
import { AnnotationShape } from "../AnnotationShape";

type AnnotationShapesProps = {
  annotations: Array<Selection>;
};

export const AnnotationShapes = ({ annotations }: AnnotationShapesProps) => {
  const categories = useSelector(visibleCategoriesSelector);

  const [visible, setVisible] = useState<Array<Selection>>([]);

  useEffect(() => {
    setVisible(
      annotations.filter((annotation: Selection) =>
        categories.includes(annotation.categoryId)
      )
    );
  }, [annotations, categories]);

  return (
    <React.Fragment>
      {visible.map((annotation) => (
        <AnnotationShape selection={annotation} />
      ))}
    </React.Fragment>
  );
};
