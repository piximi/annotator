import React, { useEffect, useRef } from "react";
import { Category } from "../../../../../../types/Category";
import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import { Selection } from "../../../../../../types/Selection";
import { useDispatch, useSelector } from "react-redux";
import {
  categoriesSelector,
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
  annotation: Selection;
  annotationTool?: AnnotationTool;
  imagePosition: { x: number; y: number };
  stageScale: { x: number; y: number };
};

export const Annotation = ({
  annotation,
  annotationTool,
  imagePosition,
  stageScale,
}: AnnotationProps) => {
  const ref = useRef<Konva.Line | null>(null);

  useEffect(() => {
    ref.current = new Konva.Line();
  }, []);

  const dispatch = useDispatch();

  const categories = useSelector(categoriesSelector);
  const toolType = useSelector(toolTypeSelector);

  const fill = _.find(
    categories,
    (category: Category) => category.id === annotation.categoryId
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

  const stagedPoints: Array<number> = _.flatten(
    _.map(_.chunk(annotation.contour, 2), (coords: Array<number>) => {
      return [
        coords[0] + imagePosition.x / stageScale.x,
        coords[1] + imagePosition.y / stageScale.y,
      ];
    })
  );

  return (
    <ReactKonva.Line
      closed
      fill={fill}
      id={annotation.id}
      onClick={onPointerClick}
      opacity={0.5}
      points={stagedPoints}
      ref={ref}
      strokeWidth={1}
      scaleX={stageScale.x}
      scaleY={stageScale.y}
    />
  );
};
