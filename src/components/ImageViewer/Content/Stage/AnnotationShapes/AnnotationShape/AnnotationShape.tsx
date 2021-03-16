import React from "react";
import { Category } from "../../../../../../types/Category";
import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import { Selection } from "../../../../../../types/Selection";
import { useSelector } from "react-redux";
import { categoriesSelector } from "../../../../../../store/selectors";
import Konva from "konva";

type AnnotationShapeProps = {
  annotation: Selection;
};

export const AnnotationShape = React.forwardRef<
  Konva.Line,
  AnnotationShapeProps
>(({ annotation }, ref) => {
  const categories = useSelector(categoriesSelector);

  const fill = _.find(
    categories,
    (category: Category) => category.id === annotation.categoryId
  )?.color;

  const onContextMenu = (event: Konva.KonvaEventObject<PointerEvent>) => {};

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
