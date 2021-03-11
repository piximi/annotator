import { useEffect, useState } from "react";
import { Tool } from "../../types/Tool";
import { ZoomTool } from "../../image/Tool/ZoomTool";
import { ZoomSettings } from "../../types/ZoomSettings";
import * as ImageJS from "image-js";

export const useZoomOperator = (
  operation: Tool,
  src: string,
  zoomSettings: ZoomSettings
) => {
  const [operator, setOperator] = useState<ZoomTool>();

  useEffect(() => {
    if (operation !== Tool.Zoom) return;

    ImageJS.Image.load(src).then((image: ImageJS.Image) => {
      setOperator(new ZoomTool(image));
    });
  }, [operation, src]);

  useEffect(() => {
    if (operation !== Tool.Zoom) return;

    if (!operator) return;
    // @ts-ignore
    operator.mode = zoomSettings.zoomMode;
  }, [zoomSettings.zoomMode]);

  useEffect(() => {
    if (operation !== Tool.Zoom) return;
    console.info("Resetting");
    if (!operator) return;
    operator.reset();
  }, [zoomSettings.zoomReset]);

  useEffect(() => {
    if (operation !== Tool.Zoom) return;

    if (!operator) return;
    // @ts-ignore
    operator.center = zoomSettings.zoomAutomaticCentering;
  }, [zoomSettings.zoomAutomaticCentering]);

  return operator;
};
