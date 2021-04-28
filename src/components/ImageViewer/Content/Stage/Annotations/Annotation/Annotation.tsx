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
  setSelectedAnnotation,
  setSelectedAnnotationsIds,
  setSeletedCategory,
} from "../../../../../../store";
import { ToolType } from "../../../../../../types/ToolType";
import { selectedAnnotationsIdsSelector } from "../../../../../../store/selectors/selectedAnnotationsIdsSelector";
import { useKeyPress } from "../../../../../../hooks/useKeyPress";
import { getOverlappingAnnotations } from "../../../../../../image/imageHelper";
import { currentPositionSelector } from "../../../../../../store/selectors/currentPositionSelector";
import { selectedAnnotationSelector } from "../../../../../../store/selectors/selectedAnnotationSelector";

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

  const selectedAnnotationsIds = useSelector(selectedAnnotationsIdsSelector);

  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  const currentPosition = useSelector(currentPositionSelector);

  const annotations = useSelector(imageInstancesSelector);

  const shiftPress = useKeyPress("Shift");

  const [overlappingAnnotationsIds, setOverlappingAnnotationsIds] = useState<
    Array<string>
  >([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const fill = _.find(
    categories,
    (category: CategoryType) => category.id === annotation.categoryId
  )?.color;

  const onPointerClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (toolType !== ToolType.Pointer) return;

    event.evt.preventDefault();

    //handle case of overlapping annotations
    if (currentPosition && annotations) {
      const scaledCurrentPosition = {
        x: currentPosition.x / stageScale,
        y: currentPosition.y / stageScale,
      };
      setOverlappingAnnotationsIds(
        getOverlappingAnnotations(scaledCurrentPosition, annotations)
      );
      if (
        overlappingAnnotationsIds.length > 1 &&
        selectedAnnotation &&
        overlappingAnnotationsIds.includes(selectedAnnotation.id)
      ) {
        //if annotation has already been selected and there are multiple annotations
        setCurrentIndex(
          currentIndex + 1 === overlappingAnnotationsIds.length
            ? 0
            : currentIndex + 1
        );
      }
    }

    dispatch(
      setSelectedAnnotation({
        selectedAnnotation: annotation,
      })
    );

    if (!shiftPress) {
      dispatch(
        setSelectedAnnotationsIds({
          selectedAnnotationsIds: [annotation.id],
        })
      );
    } else {
      //unselect if already there
      if (_.includes(selectedAnnotationsIds, annotation.id)) {
        setSelectedAnnotationsIds({
          selectedAnnotationsIds: _.filter(
            selectedAnnotationsIds,
            (annotationId: string) => {
              return annotationId !== annotation.id;
            }
          ),
        });
      } else {
        dispatch(
          setSelectedAnnotationsIds({
            selectedAnnotationsIds: [...selectedAnnotationsIds, annotation.id],
          })
        );
      }
    }

    dispatch(
      setSeletedCategory({
        selectedCategory: annotation.categoryId,
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
        fill={fill}
        onClick={onPointerClick}
        opacity={0.5}
        points={annotation.contour}
        scale={{ x: stageScale, y: stageScale }}
        strokeWidth={1}
      />
      <ReactKonva.Line // transform needs to attach to a line that does not use scale prop
        closed
        fill={fill}
        id={annotation.id}
        onClick={onPointerClick}
        opacity={0.5}
        points={scaledContour}
        strokeWidth={1}
        visible={false}
      />
    </ReactKonva.Group>
  );
};
