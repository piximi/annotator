import { ToolType } from "../../types/ToolType";
import { getOverlappingAnnotations } from "../../image/imageHelper";
import { AnnotationType } from "../../types/AnnotationType";
import {
  applicationSlice,
  setPointerSelection,
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
import { currentIndexSelector } from "../../store/selectors/currentIndexSelector";
import { useHotkeys } from "react-hotkeys-hook";
import hotkeys from "hotkeys-js";
import { useState } from "react";
import { pointerSelectionSelector } from "../../store/selectors/pointerSelectionSelector";

export const usePointer = () => {
  const dispatch = useDispatch();

  const delta = 10;

  const toolType = useSelector(toolTypeSelector);

  const selectedAnnotations = useSelector(selectedAnnotationsSelector);

  const pointerSelection = useSelector(pointerSelectionSelector);

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

  const onMouseDown = (position: { x: number; y: number }) => {
    dispatch(
      setPointerSelection({
        pointerSelection: {
          ...pointerSelection,
          dragging: false,
          minimum: position,
          selecting: true,
        },
      })
    );
  };

  const onMouseMove = (position: { x: number; y: number }) => {
    if (!pointerSelection.selecting) return;

    if (!position || !pointerSelection.minimum) return;

    dispatch(
      setPointerSelection({
        pointerSelection: {
          ...pointerSelection,
          dragging: Math.abs(position.x - pointerSelection.minimum.x) >= delta,
          maximum: position,
        },
      })
    );
  };

  const onMouseUp = (position: { x: number; y: number }) => {
    if (!pointerSelection.selecting) return;

    if (pointerSelection.dragging) {
      if (!position) return;

      dispatch(
        setPointerSelection({
          pointerSelection: { ...pointerSelection, maximum: position },
        })
      );
    } else {
      onClick(position);
    }

    dispatch(
      setPointerSelection({
        pointerSelection: { ...pointerSelection, selecting: false },
      })
    );
  };

  const onClick = (position: { x: number; y: number }) => {
    if (toolType !== ToolType.Pointer) return;

    if (!position) return;

    if (!annotations) return;

    const scaledCurrentPosition = {
      x: position.x / stageScale,
      y: position.y / stageScale,
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
        return annotation.id === overlappingAnnotationsIds[0];
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

  return { onMouseDown, onMouseUp, onMouseMove, onPointerClick: onClick };
};
