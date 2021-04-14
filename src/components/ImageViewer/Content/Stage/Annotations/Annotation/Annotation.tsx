import React, { useEffect, useRef } from "react";
import { CategoryType } from "../../../../../../types/CategoryType";
import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import { AnnotationType } from "../../../../../../types/AnnotationType";
import { useDispatch, useSelector } from "react-redux";
import {
  categoriesSelector,
  stageScaleSelector,
  toolTypeSelector,
} from "../../../../../../store/selectors";
import Konva from "konva";
import { AnnotationTool } from "../../../../../../image/Tool";
import {
  setSelectedAnnotation,
  setSeletedCategory,
} from "../../../../../../store";
import { ToolType } from "../../../../../../types/ToolType";

type AnnotationProps = {
  annotation: AnnotationType;
  annotationTool?: AnnotationTool;
};

export const Annotation = ({ annotation, annotationTool }: AnnotationProps) => {
  const ref = useRef<Konva.Line | null>(null);

  useEffect(() => {
    ref.current = new Konva.Line();
  }, []);

  const dispatch = useDispatch();

  const categories = useSelector(categoriesSelector);
  const toolType = useSelector(toolTypeSelector);
  const stageScale = useSelector(stageScaleSelector);

  const fill = _.find(
    categories,
    (category: CategoryType) => category.id === annotation.categoryId
  )?.color;

  const onPointerClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (toolType !== ToolType.Pointer) return;

    event.evt.preventDefault();

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
  };

  return (
    <ReactKonva.Line
      closed
      fill={fill}
      id={annotation.id}
      onClick={onPointerClick}
      opacity={0.5}
      points={annotation.contour}
      ref={ref}
      scale={{ x: stageScale, y: stageScale }}
      strokeWidth={1}
    />
  );
};
