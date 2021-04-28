import React, { useEffect, useRef, useState } from "react";
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
import { AnnotationTool } from "../../../../../../image/Tool";
import {
  setSeletedCategory,
  setSelectedAnnotations,
  setSelectedAnnotationId,
} from "../../../../../../store";
import { ToolType } from "../../../../../../types/ToolType";
import { selectedAnnotationsIdsSelector } from "../../../../../../store/selectors/selectedAnnotationsIdsSelector";
import { useKeyPress } from "../../../../../../hooks/useKeyPress";
import { getOverlappingAnnotations } from "../../../../../../image/imageHelper";
import { currentPositionSelector } from "../../../../../../store/selectors/currentPositionSelector";
import { selectedAnnotationSelector } from "../../../../../../store/selectors/selectedAnnotationSelector";
import { selectedAnnotationsSelector } from "../../../../../../store/selectors/selectedAnnotationsSelector";
import { selectedAnnotationIdSelector } from "../../../../../../store/selectors/selectedAnnotationIdSelector";

type AnnotationProps = {
  annotation: AnnotationType;
  annotationTool?: AnnotationTool;
};

export const Annotation = ({ annotation, annotationTool }: AnnotationProps) => {
  const dispatch = useDispatch();

  const [scaledContour, setScaledContour] = useState<Array<number>>([]);

  const categories = useSelector(categoriesSelector);
  const toolType = useSelector(toolTypeSelector);
  const stageScale = useSelector(stageScaleSelector);

  const selectedAnnotationId = useSelector(selectedAnnotationIdSelector);

  const selectedAnnotations = useSelector(selectedAnnotationsSelector);

  const selectedAnnotationsIds = useSelector(selectedAnnotationsIdsSelector);

  const currentPosition = useSelector(currentPositionSelector);

  const annotations = useSelector(imageInstancesSelector);

  const shiftPress = useKeyPress("Shift");

  let overlappingAnnotationsIds: Array<string> = [];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

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
      setCurrentIndex(
        currentIndex + 1 === overlappingAnnotationsIds.length
          ? 0
          : currentIndex + 1
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
        setSelectedAnnotationId({
          selectedAnnotationId: currentAnnotation.id,
        })
      );

      dispatch(
        setSelectedAnnotations({
          selectedAnnotations: [currentAnnotation],
        })
      );
    }

    if (shiftPress) {
      if (selectedAnnotationsIds.includes(currentAnnotation.id)) {
        dispatch(
          setSelectedAnnotations({
            selectedAnnotations: selectedAnnotations.filter(
              (annotation: AnnotationType) => {
                return annotation.id !== currentAnnotation.id;
              }
            ),
          })
        );
      } else {
        dispatch(
          setSelectedAnnotations({
            selectedAnnotations: [...selectedAnnotations, currentAnnotation],
          })
        );
      }
    }

    dispatch(
      setSeletedCategory({
        selectedCategory: currentAnnotation.categoryId,
      })
    );
  };

  useEffect(() => {
    if (!annotation || !annotation.contour) return;
    setScaledContour(
      annotation.contour.map((point: number) => {
        return point * stageScale;
      })
    );
  }, [stageScale, annotation.contour]);

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
      <ReactKonva.Line // transform needs to attach to a line that does not use scale prop
        closed
        fill={fill}
        id={annotation.id}
        onClick={onPointerClick}
        opacity={0.5}
        points={scaledContour}
        visible={false}
      />
    </ReactKonva.Group>
  );
};
