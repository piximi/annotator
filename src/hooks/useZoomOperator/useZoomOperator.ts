import { useState } from "react";
import { Operation } from "../../types/Operation";
import { KonvaEventObject } from "konva/types/Node";

export const useZoomOperator = (operation: Operation) => {
  const [scale, setScale] = useState<number>(1.0);

  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    if (operation !== Operation.Zoom) return;

    setScale(event.evt.deltaY > 0 ? scale * 1.01 : scale / 1.01);

    const stage = event.target.getStage();

    if (!stage) return;

    const position = stage.getPointerPosition();

    if (!position) return;

    const origin = {
      x: position.x / scale - stage.x() / scale,
      y: position.y / scale - stage.y() / scale,
    };

    setX(-(origin.x - position.x / scale) * scale);
    setY(-(origin.y - position.y / scale) * scale);
  };

  return {
    onWheel,
    scale,
    x,
    y,
  };
};
