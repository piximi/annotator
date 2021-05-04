import Konva from "konva";
import { ToolType } from "../../types/ToolType";
import { getOverlappingAnnotations } from "../../image/imageHelper";
import { AnnotationType } from "../../types/AnnotationType";
import {
  applicationSlice,
  setSelectedAnnotation,
  setSelectedAnnotations,
  setSeletedCategory,
} from "../../store/slices";
import { useDispatch, useSelector } from "react-redux";
import {
  imageInstancesSelector,
  stageScaleSelector,
  toolTypeSelector,
} from "../../store/selectors";
import { selectedAnnotationsSelector } from "../../store/selectors/selectedAnnotationsSelector";
import { currentPositionSelector } from "../../store/selectors/currentPositionSelector";
import { currentIndexSelector } from "../../store/selectors/currentIndexSelector";
import { useHotkeys } from "react-hotkeys-hook";
import hotkeys from "hotkeys-js";
import { useState } from "react";

export const usePointer = () => {
  const dispatch = useDispatch();

  const toolType = useSelector(toolTypeSelector);

  const selectedAnnotations = useSelector(selectedAnnotationsSelector);

  const currentPosition = useSelector(currentPositionSelector);

  const annotations = useSelector(imageInstancesSelector);

  const stageScale = useSelector(stageScaleSelector);

  let overlappingAnnotationsIds: Array<string> = [];

  const currentIndex = useSelector(currentIndexSelector);

  const [shift, setShift] = useState<boolean>(false);

  useHotkeys(
    "*",
    (event) => {
      if (hotkeys.shift) {
        if (event.type === "keyup") {
          setShift(false);
        }
      }
    },
    { keyup: true }
  );

  useHotkeys(
    "*",
    (event) => {
      if (hotkeys.shift) {
        if (event.type === "keydown") {
          setShift(true);
        }
      }
    },
    { keydown: true }
  );

  const onMouseDown = () => {
    console.info("Mouse down!");
  };

  const onMouseMove = () => {
    console.info("Mouse move!");
  };

  const onMouseUp = () => {
    console.info("Mouse up!");
  };

  const onPointerClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (toolType !== ToolType.Pointer) return;

    event.evt.preventDefault();

    console.info(event.target.attrs.id);

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

    if (overlappingAnnotationsIds.length > 1) {
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
      currentAnnotation = annotations.filter((annotation: AnnotationType) => {
        return annotation.id === event.target.attrs.id;
      })[0];
    }

    if (!shift) {
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

    if (shift) {
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

  return { onMouseDown, onMouseUp, onMouseMove, onPointerClick };
};
