import React from "react";
import { Category } from "../../../../../../types/Category";
import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import { Selection } from "../../../../../../types/Selection";
import { useDispatch, useSelector } from "react-redux";
import { categoriesSelector } from "../../../../../../store/selectors";
import Konva from "konva";
import { AnnotationTool } from "../../../../../../image/Tool";
import { slice } from "../../../../../../store/slices";

type AnnotationShapeProps = {
  annotation: Selection;
  annotationTool?: AnnotationTool;
};

export const AnnotationShape = React.forwardRef<
  Konva.Line,
  AnnotationShapeProps
>(({ annotation, annotationTool }, ref) => {
  const dispatch = useDispatch();

  const categories = useSelector(categoriesSelector);

  const fill = _.find(
    categories,
    (category: Category) => category.id === annotation.categoryId
  )?.color;

  const onContextMenu = (event: Konva.KonvaEventObject<MouseEvent>) => {
    event.evt.preventDefault();

    if (!annotationTool) return;

    if (annotationTool.annotating) return;

    annotationTool.deselect();

    dispatch(
      slice.actions.setSelectedAnnotation({ selectedAnnotation: annotation.id })
    );

    dispatch(
      slice.actions.setSeletedCategory({
        selectedCategory: annotation.categoryId,
      })
    );
  };

  return (
    <ReactKonva.Line
      closed
      fill={fill}
      onContextMenu={onContextMenu}
      opacity={0.5}
      points={annotation.contour}
      ref={ref}
      strokeWidth={1}
    />
  );
});
