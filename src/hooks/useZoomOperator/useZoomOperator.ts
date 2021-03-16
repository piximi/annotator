import { useEffect, useReducer, useRef, useState } from "react";
import { ToolType } from "../../types/ToolType";
import { ZoomTool } from "../../image/Tool/ZoomTool";
import { ZoomSettings } from "../../types/ZoomSettings";
import * as ImageJS from "image-js";
import { KonvaEventObject } from "konva/types/Node";

export const useZoomOperator = (
  operation: ToolType,
  src: string,
  zoomSettings: ZoomSettings
) => {
  const [operator, setOperator] = useState<ZoomTool>();
  const [, update] = useReducer((x) => x + 1, 0);

  const onZoomClick = (event: KonvaEventObject<MouseEvent>) => {
    if (operation !== ToolType.Zoom) return;

    if (!operator) return;

    operator.onClick(event);

    update();
  };

  const onZoomWheel = (event: KonvaEventObject<WheelEvent>) => {
    if (operation !== ToolType.Zoom) return;

    if (!operator) return;

    operator.onWheel(event);

    update();
  };

  useEffect(() => {
    if (operation !== ToolType.Zoom) return;

    if (operator) return;

    ImageJS.Image.load(src).then((image: ImageJS.Image) => {
      setOperator(new ZoomTool(image));
    });
  }, [operation, src]);

  useEffect(() => {
    if (operation !== ToolType.Zoom) return;

    if (!operator) return;

    // @ts-ignore
    operator.mode = zoomSettings.zoomMode;
  }, [zoomSettings.zoomMode]);

  useEffect(() => {
    if (operation !== ToolType.Zoom) return;

    if (!operator) return;

    operator.reset();

    update();
  }, [zoomSettings.zoomReset]);

  useEffect(() => {
    if (operation !== ToolType.Zoom) return;

    if (!operator) return;
    // @ts-ignore
    operator.center = zoomSettings.zoomAutomaticCentering;
  }, [zoomSettings.zoomAutomaticCentering]);

  return {
    zoomOperator: operator,
    onZoomClick: onZoomClick,
    onZoomWheel: onZoomWheel,
  };
};
