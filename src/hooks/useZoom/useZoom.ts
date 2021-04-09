import Konva from "konva";
import React from "react";
import { KonvaEventObject } from "konva/types/Node";
import { useDispatch, useSelector } from "react-redux";
import { ToolType } from "../../types/ToolType";
import { ZoomModeType } from "../../types/ZoomModeType";
import { setOffset, setStageScale, setZoomSelection } from "../../store";
import {
  imageSelector,
  stageScaleSelector,
  toolTypeSelector,
  zoomSelectionSelector,
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
  const zoomSelection = useSelector(zoomSelectionSelector);

  const imageWidth =
    (image && image.shape ? image.shape.width : 512) * stageScale;

  const zoom = (scaleBy: number, zoomIn: boolean = true) => {
    dispatch(
      setStageScale({
        stageScale: zoomIn ? stageScale * scaleBy : stageScale / scaleBy,
      })
    );
  };

  const offset = (
    point: { x: number; y: number },
    scaleBy: number,
    zoomIn: boolean = true
  ) => {
    dispatch(
      setOffset({
        offset: {
          x: zoomIn ? point.x * scaleBy : point.x / scaleBy,
          y: zoomIn ? point.y * scaleBy : point.y / scaleBy,
        },
      })
    );
  };

  const relativePosition = () => {
    if (!imageRef || !imageRef.current) return;

    return getRelativePointerPosition(imageRef.current);
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

    const relative = relativePosition();

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

    const relative = relativePosition();

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
    if (!zoomSelection.selecting) return;

    if (zoomSelection.dragging) {
      const relative = relativePosition();

      if (!relative) return;

      dispatch(
        setZoomSelection({
          zoomSelection: { ...zoomSelection, maximum: relative },
        })
      );

      if (!zoomSelection.minimum) return;

      const selectedWidth = relative.x - zoomSelection.minimum.x;

      const deltaScale = imageWidth / selectedWidth / stageScale;

      if (!automaticCentering) {
        offset(
          {
            x: zoomSelection.minimum.x + selectedWidth / 2,
            y: zoomSelection.minimum.y + selectedWidth / 2,
          },
          deltaScale
        );
      }
      zoom(deltaScale);
    } else {
      if (!automaticCentering) {
        const position = relativePosition();

        if (!position) return;

        offset(position, scaleBy, mode === ZoomModeType.In);
      }

      zoom(scaleBy, mode === ZoomModeType.In);
    }
    dispatch(
      setZoomSelection({
        zoomSelection: { ...zoomSelection, selecting: false },
      })
    );
  };

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    zoom(scaleBy, event.evt.deltaY > 0);
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
  };
};
