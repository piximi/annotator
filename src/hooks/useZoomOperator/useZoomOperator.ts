import { useEffect, useState } from "react";
import { Tool } from "../../types/Tool";
import { KonvaEventObject } from "konva/types/Node";
import { ZoomTool } from "../../image/Tool/ZoomTool";

export const useZoomOperator = (operation: Tool, operator: ZoomTool) => {
  const [scale, setScale] = useState<number>(1.0);

  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);

  useEffect(() => {
    if (!operator || !operator.minimum || !operator.maximum) return;

    const newScale =
      operator.image.width / (operator.maximum.x - operator.minimum.x);

    setX(-1 * operator.minimum.x * newScale);
    setY(-1 * operator.minimum.y * newScale);

    setScale(newScale);
  }, [operator?.selected]);

  useEffect(() => {
    if (!operator || !operator.minimum || !operator.scale) return;
    setScale(operator.scale);
    setX(operator.minimum.x - operator.minimum.x * operator.scale);
    setY(operator.minimum.y - operator.minimum.y * operator.scale);
  }, [operator?.scale]);

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
