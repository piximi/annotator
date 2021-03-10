import { useEffect, useState } from "react";
import { Tool } from "../../types/Tool";
import { KonvaEventObject } from "konva/types/Node";
import { ZoomTool } from "../../image/Tool/ZoomTool";
import { ZoomSettings } from "../../types/ZoomSettings";

export const useZoomOperator = (
  operation: Tool,
  operator: ZoomTool,
  zoomSettings: ZoomSettings
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
    if (operation !== Tool.Zoom) return;

    if (!operator) return;
    operator.reset();
    setScale(1.0);
    setX(0);
    setY(0);

    operator.deselect();
  }, [zoomSettings.zoomReset]);

  useEffect(() => {
    if (!operator) return;
    // @ts-ignore
    operator.mode = zoomSettings.zoomMode;
  }, [zoomSettings.zoomMode]);

  useEffect(() => {
    if (!operator) return;
    // @ts-ignore
    operator.center = zoomSettings.zoomAutomaticCentering;
  }, [zoomSettings.zoomAutomaticCentering]);

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    if (operation !== Tool.Zoom) return;

    const newScale = event.evt.deltaY > 0 ? scale * 1.1 : scale / 1.1;

    const stage = event.target.getStage();

    if (!stage) return;

    const position = stage.getPointerPosition();

    if (!position) return;

    const origin = {
      x: position.x / scale - stage.x() / scale,
      y: position.y / scale - stage.y() / scale,
    };

    if (zoomSettings.zoomAutomaticCentering) {
      setX(operator.image.width / 2 - (operator.image.width / 2) * newScale);
      setY(operator.image.height / 2 - (operator.image.height / 2) * newScale);
    } else {
      setX(-(origin.x - position.x / newScale) * newScale);
      setY(-(origin.y - position.y / newScale) * newScale);
    }

    setScale(newScale);

    operator.x = -(origin.x - position.x / newScale) * newScale;
    operator.y = -(origin.x - position.x / newScale) * newScale;
    operator.scale = newScale;
  };

  return {
    onWheel,
    scale,
    x,
    y,
  };
};
