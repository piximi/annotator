import { useEffect, useState } from "react";
import { Tool } from "../../types/Tool";
import { KonvaEventObject } from "konva/types/Node";
import { ZoomTool } from "../../image/Tool/ZoomTool";
import { ZoomMode } from "../../types/ZoomMode";

export const useZoomOperator = (
  operation: Tool,
  operator: ZoomTool,
  zoomMode: ZoomMode,
  zoomReset: boolean
) => {
  const [scale, setScale] = useState<number>(1.0);

  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);

  useEffect(() => {
    if (!operator || !operator.scale || !operator.selected) return;

    setX(operator.x);
    setY(operator.y);

    setScale(operator.scale);

    operator.deselect();
  }, [operator?.selected]);

  useEffect(() => {
    if (!operator) return;
    operator.reset();
    setScale(1.0);
    setX(0);
    setY(0);

    operator.deselect();
  }, [zoomReset]);

  useEffect(() => {
    if (!operator) return;
    // @ts-ignore
    operator.mode = zoomMode;
  }, [zoomMode]);

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    if (operation !== Tool.Zoom) return;

    const newScale = event.evt.deltaY > 0 ? scale * 1.01 : scale / 1.01;

    const stage = event.target.getStage();

    if (!stage) return;

    const position = stage.getPointerPosition();

    if (!position) return;

    const origin = {
      x: position.x / scale - stage.x() / scale,
      y: position.y / scale - stage.y() / scale,
    };

    setX(-(origin.x - position.x / newScale) * newScale);
    setY(-(origin.y - position.y / newScale) * newScale);

    setScale(newScale);
  };

  return {
    onWheel,
    scale,
    x,
    y,
  };
};
