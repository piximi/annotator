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

    const relative = getRelativePointerPosition(imageRef.current);

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

    if (!imageRef || !imageRef.current) return;

    const relative = getRelativePointerPosition(imageRef.current);

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

    if (!imageRef || !imageRef.current) return;

    if (zoomSelection.dragging) {
      const relative = getRelativePointerPosition(imageRef.current);

      if (!relative) return;

      dispatch(
        setZoomSelection({
          zoomSelection: { ...zoomSelection, maximum: relative },
        })
      );

      if (!zoomSelection.maximum || !zoomSelection.minimum) return;

      if (!automaticCentering) {
        const center = {
          x:
            zoomSelection.minimum.x +
            (zoomSelection.maximum.x - zoomSelection.minimum.x) / 2,
          y:
            zoomSelection.minimum.y +
            (zoomSelection.maximum.y - zoomSelection.minimum.y) / 2,
        };

        const deltaScale =
          imageWidth /
          (zoomSelection.maximum.x - zoomSelection.minimum.x) /
          stageScale;

        dispatch(
          setOffset({
            offset: { x: center.x * deltaScale, y: center.y * deltaScale },
          })
        );
      }

      zoom(imageWidth / (relative.x - zoomSelection.minimum.x) / stageScale);
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
