import React, { useEffect, useRef } from "react";
import { Category } from "../../../../../../types/Category";
import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import { Selection } from "../../../../../../types/Selection";
import { useDispatch, useSelector } from "react-redux";
import { categoriesSelector } from "../../../../../../store/selectors";
import Konva from "konva";
import { AnnotationTool } from "../../../../../../image/Tool";
import {
  setSelectedAnnotationNode,
  setSelectedAnnotation,
  setSeletedCategory,
} from "../../../../../../store";

type AnnotationShapeProps = {
  annotation: Selection;
  annotationTool?: AnnotationTool;
};

export const AnnotationShape = ({
  annotation,
  annotationTool,
}: AnnotationShapeProps) => {
  const ref = useRef<Konva.Line | null>(null);

  useEffect(() => {
    ref.current = new Konva.Line();
  }, []);

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

    if (!ref || !ref.current) return;

    dispatch(
      setSeletedCategory({
        selectedCategory: annotation.categoryId,
      })
    );

    dispatch(
      setSelectedAnnotation({
        selectedAnnotation: annotation.id,
      })
    );

    dispatch(
      setSelectedAnnotationNode({
        selectedAnnotationNode: ref.current._id,
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
};
