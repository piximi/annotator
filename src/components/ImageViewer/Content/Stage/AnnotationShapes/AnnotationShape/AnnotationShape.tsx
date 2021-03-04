import React from "react";
import { Category } from "../../../../../../types/Category";
import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import { Selection } from "../../../../../../types/Selection";
import { useSelector } from "react-redux";
import { categoriesSelector } from "../../../../../../store/selectors";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

type AnnotationShapeProps = {
  annotation: Selection;
};

export const AnnotationShape = ({ annotation }: AnnotationShapeProps) => {
  const categories = useSelector(categoriesSelector);

  const fill = _.find(
    categories,
    (category: Category) => category.id === annotation.categoryId
  )?.color;

  const onContextMenu = (event: KonvaEventObject<PointerEvent>) => {};

  return (
    <ReactKonva.Line
      closed
      fill={fill}
      onContextMenu={onContextMenu}
      opacity={0.5}
      points={annotation.contour}
      strokeWidth={1}
    />
  );
};
