import Konva from "konva";
import React, { useState } from "react";
import { KonvaEventObject } from "konva/types/Node";
import { useDispatch, useSelector } from "react-redux";
import { ToolType } from "../../types/ToolType";
import { ZoomModeType } from "../../types/ZoomModeType";
import { setOffset, setStageScale } from "../../store";
import {
  imageSelector,
  stageScaleSelector,
  toolTypeSelector,
  zoomToolOptionsSelector,
} from "../../store/selectors";

export const useZoom = (
  stageRef: React.RefObject<Konva.Stage>,
  imageRef: React.RefObject<Konva.Image>
) => {
  const delta = 10;
  const scaleBy = 1.25;

  const dispatch = useDispatch();

  const image = useSelector(imageSelector);
  const stageScale = useSelector(stageScaleSelector);
  const toolType = useSelector(toolTypeSelector);
  const { automaticCentering, mode } = useSelector(zoomToolOptionsSelector);

  const [dragging, setDragging] = useState<boolean>(false);
  const [maximum, setMaximum] = useState<{ x: number; y: number }>();
  const [minimum, setMinimum] = useState<{ x: number; y: number }>();
  const [selecting, setSelecting] = useState<boolean>(false);

  const imageWidth =
    (image && image.shape ? image.shape.width : 512) * stageScale;
  const imageHeight =
    (image && image.shape ? image.shape.height : 512) * stageScale;

  const zoom = (deltaY: number, scaleBy: number) => {
    dispatch(
      setStageScale({
        stageScale: deltaY > 0 ? stageScale * scaleBy : stageScale / scaleBy,
      })
    );
  };

  // this function will return pointer position relative to the passed node
  const getRelativePointerPosition = (node: Konva.Node) => {
    const transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    const stage = node.getStage();

    if (!stage) return;

    // get pointer (say mouse or touch) position
    const pos = stage.getPointerPosition();

    if (!pos) return;

    // now we can find relative point
    return transform.point(pos);
  };

  const onMouseDown = () => {
    if (toolType !== ToolType.Zoom) return;

    if (!imageRef || !imageRef.current) return;

    setDragging(false);

    const relative = getRelativePointerPosition(imageRef.current);

    setMinimum(relative);

    setSelecting(true);
  };

  const onMouseMove = () => {
    if (mode === ZoomModeType.Out) return;

    if (!selecting) return;

    if (!imageRef || !imageRef.current) return;

    setDragging(true);

    const relative = getRelativePointerPosition(imageRef.current);

    if (!minimum) return;

    setMaximum(relative);

    if (!maximum) return;

    if (dragging && Math.abs(maximum.x - minimum.x) < delta) {
      setDragging(false);
    }
  };

  const onMouseUp = () => {
    if (!selecting) return;

    if (!imageRef || !imageRef.current) return;

    if (dragging) {
      const relative = getRelativePointerPosition(imageRef.current);

      if (!relative || !minimum) return;

      setMaximum(relative);

      if (!maximum) return;

      const newScale = imageWidth / (maximum.x - minimum.x);
      const deltaScale = newScale / stageScale;

      dispatch(
        setStageScale({ stageScale: imageWidth / (maximum.x - minimum.x) })
      );

      if (!automaticCentering) {
        const centerX = minimum.x + (maximum.x - minimum.x) / 2;
        const centerY = minimum.y + (maximum.y - minimum.y) / 2;

        dispatch(
          setOffset({
            offset: { x: centerX * deltaScale, y: centerY * deltaScale },
          })
        );
      }
    } else {
      if (!automaticCentering) {
        const position = getRelativePointerPosition(imageRef.current);

        if (!position) return;

        const pos =
          mode === ZoomModeType.In
            ? { x: position.x * scaleBy, y: position.y * scaleBy }
            : { x: position.x / scaleBy, y: position.y / scaleBy };
        dispatch(setOffset({ offset: pos }));
      }

      zoom(mode === ZoomModeType.In ? 100 : -100, scaleBy);
    }
    setSelecting(false);
  };

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    dispatch(
      setStageScale({
        stageScale:
          event.evt.deltaY > 0 ? stageScale * 1.25 : stageScale / 1.25,
      })
    );
  };

  return {
    dragging,
    maximum,
    minimum,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    selecting,
  };
};
