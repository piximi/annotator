import React from "react";
import { CategoryType } from "../../../../../../types/CategoryType";
import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import { AnnotationType } from "../../../../../../types/AnnotationType";
import { useDispatch, useSelector } from "react-redux";
import {
  categoriesSelector,
  imageInstancesSelector,
  stageScaleSelector,
  toolTypeSelector,
} from "../../../../../../store/selectors";
import Konva from "konva";
import {
  applicationSlice,
  setSelectedAnnotation,
  setSelectedAnnotations,
  setSeletedCategory,
} from "../../../../../../store";
import { ToolType } from "../../../../../../types/ToolType";
import { useKeyPress } from "../../../../../../hooks/useKeyPress";
import { getOverlappingAnnotations } from "../../../../../../image/imageHelper";
import { currentPositionSelector } from "../../../../../../store/selectors/currentPositionSelector";
import { selectedAnnotationsSelector } from "../../../../../../store/selectors/selectedAnnotationsSelector";
import { selectedAnnotationIdSelector } from "../../../../../../store/selectors/selectedAnnotationIdSelector";
import { currentIndexSelector } from "../../../../../../store/selectors/currentIndexSelector";

type AnnotationProps = {
  annotation: AnnotationType;
};

export const Annotation = ({ annotation }: AnnotationProps) => {
  const dispatch = useDispatch();

  const categories = useSelector(categoriesSelector);
  const toolType = useSelector(toolTypeSelector);
  const stageScale = useSelector(stageScaleSelector);

  const selectedAnnotationId = useSelector(selectedAnnotationIdSelector);

  const selectedAnnotations = useSelector(selectedAnnotationsSelector);

  const currentPosition = useSelector(currentPositionSelector);

  const annotations = useSelector(imageInstancesSelector);

  const shiftPress = useKeyPress("Shift");

  let overlappingAnnotationsIds: Array<string> = [];

  const currentIndex = useSelector(currentIndexSelector);

  const fill = _.find(
    categories,
    (category: CategoryType) => category.id === annotation.categoryId
  )?.color;

  const onPointerClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (toolType !== ToolType.Pointer) return;

    event.evt.preventDefault();

    if (!currentPosition) return;

    if (!annotations) return;

    const scaledCurrentPosition = {
      x: currentPosition.x / stageScale,
      y: currentPosition.y / stageScale,
    };

    overlappingAnnotationsIds = getOverlappingAnnotations(
      scaledCurrentPosition,
      annotations
    );

    let currentAnnotation: AnnotationType;

    if (
      overlappingAnnotationsIds.length > 1 &&
      selectedAnnotationId &&
      overlappingAnnotationsIds.includes(selectedAnnotationId)
    ) {
      dispatch(
        applicationSlice.actions.setCurrentIndex({
          currentIndex:
            currentIndex + 1 === overlappingAnnotationsIds.length
              ? 0
              : currentIndex + 1,
        })
      );
      const nextAnnotationId = overlappingAnnotationsIds[currentIndex];

      currentAnnotation = annotations.filter((annotation: AnnotationType) => {
        return annotation.id === nextAnnotationId;
      })[0];
    } else {
      currentAnnotation = annotation;
    }

    if (!shiftPress) {
      dispatch(
        setSelectedAnnotation({
          selectedAnnotation: currentAnnotation,
        })
      );

      dispatch(
        setSelectedAnnotations({
          selectedAnnotations: [currentAnnotation],
        })
      );
    }

    if (shiftPress) {
      dispatch(
        setSelectedAnnotations({
          selectedAnnotations: [...selectedAnnotations, currentAnnotation],
        })
      );
      dispatch(
        setSelectedAnnotation({
          selectedAnnotation: currentAnnotation,
        })
      );
    }

    dispatch(
      setSeletedCategory({
        selectedCategory: currentAnnotation.categoryId,
      })
    );
  };

  if (!annotation || !annotation.contour) return <React.Fragment />;

  return (
    <ReactKonva.Group>
      <ReactKonva.Line
        closed
        onClick={onPointerClick}
        points={annotation.contour}
        scale={{ x: stageScale, y: stageScale }}
        stroke="white"
        strokeWidth={1}
      />
      <ReactKonva.Line
        closed
        fill={fill}
        onClick={onPointerClick}
        opacity={0.5}
        points={annotation.contour}
        scale={{ x: stageScale, y: stageScale }}
      />
    </ReactKonva.Group>
  );
};
