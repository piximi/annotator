import React, { useEffect, useRef, useState } from "react";
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
  setSelectedAnnotationsIds,
  setSeletedCategory,
} from "../../../../../../store";
import { ToolType } from "../../../../../../types/ToolType";
import { selectedAnnotationsIdsSelector } from "../../../../../../store/selectors/selectedAnnotationsIdsSelector";
import { useKeyPress } from "../../../../../../hooks/useKeyPress";

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

  const shiftPress = useKeyPress("Shift");

  const fill = _.find(
    categories,
    (category: CategoryType) => category.id === annotation.categoryId
  )?.color;

  const onPointerClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (toolType !== ToolType.Pointer) return;

    event.evt.preventDefault();

    dispatch(
      setSeletedCategory({
        selectedCategory: annotation.categoryId,
      })
    );

    dispatch(
      setSelectedAnnotation({
        selectedAnnotation: annotation,
      })
    );

    if (!shiftPress)
      dispatch(
        setSelectedAnnotationsIds({
          selectedAnnotationsIds: [annotation.id],
        })
      );
    else {
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
  };

  useEffect(() => {
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
