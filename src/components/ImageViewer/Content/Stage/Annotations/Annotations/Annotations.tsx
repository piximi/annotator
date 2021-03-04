import React, { useEffect, useState } from "react";
import { Selection } from "../../../../../../types/Selection";
import { useSelector } from "react-redux";
import { visibleCategoriesSelector } from "../../../../../../store/selectors/visibleCategoriesSelector";
import { Annotation } from "../Annotation";

type AnnotationsProps = {
  annotations: Array<Selection>;
};

export const Annotations = ({ annotations }: AnnotationsProps) => {
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
      {visible.map((annotation: Selection) => {
        return <Annotation selection={annotation} />;
      })}
    </React.Fragment>
  );
};
