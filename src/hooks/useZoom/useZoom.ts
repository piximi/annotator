import Konva from "konva";
import React from "react";
import { KonvaEventObject } from "konva/types/Node";
import { useDispatch, useSelector } from "react-redux";
import { ToolType } from "../../types/ToolType";
import { ZoomModeType } from "../../types/ZoomModeType";
import { setOffset, setStageScale, setZoomSelection } from "../../store";
import {
  stageScaleSelector,
  toolTypeSelector,
  zoomSelectionSelector,
  zoomToolOptionsSelector,
} from "../../store/selectors";
import { imageWidthSelector } from "../../store/selectors/imageWidthSelector";

export const useZoom = (
  stageRef: React.RefObject<Konva.Stage>,
  imageRef: React.RefObject<Konva.Image>
) => {
  const delta = 10;
  const scaleBy = 1.25;

  const dispatch = useDispatch();

  const stageScale = useSelector(stageScaleSelector);
  const toolType = useSelector(toolTypeSelector);
  const { automaticCentering, mode } = useSelector(zoomToolOptionsSelector);
  const zoomSelection = useSelector(zoomSelectionSelector);

  const imageWidth = useSelector(imageWidthSelector);

  const zoomAndOffset = (
    position: { x: number; y: number } | undefined,
    scaleBy: number,
    zoomIn: boolean = true
  ) => {
    if (!automaticCentering) {
      if (!position) return;
      dispatch(
        setOffset({
          offset: {
            x: zoomIn ? position.x * scaleBy : position.x / scaleBy,
            y: zoomIn ? position.y * scaleBy : position.y / scaleBy,
          },
        })
      );
    }
    dispatch(
      setStageScale({
        stageScale: zoomIn ? stageScale * scaleBy : stageScale / scaleBy,
      })
    );
  };

  // this function will return pointer position relative to the passed node
  const getRelativePointerPosition = () => {
    if (!imageRef || !imageRef.current) return;

    const transform = imageRef.current.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    const stage = imageRef.current.getStage();

    if (!stage) return;

    // get pointer (say mouse or touch) position
    const pos = stage.getPointerPosition();

    if (!pos) return;

    // now we can find relative point
    return transform.point(pos);
  };

  const onMouseDown = () => {
    if (toolType !== ToolType.Zoom) return;

    const relative = getRelativePointerPosition();

    dispatch(
      setZoomSelection({
        zoomSelection: {
          ...zoomSelection,
          dragging: false,
          minimum: relative,
          selecting: true,
        },
      })
    );
  };

  const onMouseMove = () => {
    if (mode === ZoomModeType.Out) return;

    if (!zoomSelection.selecting) return;

    const relative = getRelativePointerPosition();

    if (!relative || !zoomSelection.minimum) return;

    dispatch(
      setZoomSelection({
        zoomSelection: {
          ...zoomSelection,
          dragging: Math.abs(relative.x - zoomSelection.minimum.x) >= delta,
          maximum: relative,
        },
      })
    );
  };

  const onMouseUp = () => {
    if (!imageWidth) return;

    if (!zoomSelection.selecting) return;

    if (zoomSelection.dragging) {
      const relative = getRelativePointerPosition();

      if (!relative) return;

      dispatch(
        setZoomSelection({
          zoomSelection: { ...zoomSelection, maximum: relative },
        })
      );

      if (!zoomSelection.minimum) return;

      const selectedWidth = relative.x - zoomSelection.minimum.x;

      zoomAndOffset(
        {
          x: zoomSelection.minimum.x + selectedWidth / 2,
          y: zoomSelection.minimum.y + selectedWidth / 2,
        },
        imageWidth / selectedWidth / stageScale
      );
    } else {
      zoomAndOffset(
        getRelativePointerPosition(),
        scaleBy,
        mode === ZoomModeType.In
      );
    }

    dispatch(
      setZoomSelection({
        zoomSelection: { ...zoomSelection, selecting: false },
      })
    );
  };

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    zoomAndOffset(getRelativePointerPosition(), scaleBy, event.evt.deltaY > 0);
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
  };
};
