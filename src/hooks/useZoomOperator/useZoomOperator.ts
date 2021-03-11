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

  //FIXME: What do I do with code below?
  // useEffect(() => {
  //   if (!operator || !operator.scale || !operator.selected) return;
  //
  //   setX(operator.x);
  //   setY(operator.y);
  //
  //   setScale(operator.scale);
  // }, [operator?.selected]);
  //
  // useEffect(() => {
  //   if (operation !== Tool.Zoom) return;
  //
  //   if (!operator) return;
  //   operator.reset();
  //   setScale(1.0);
  //   setX(0);
  //   setY(0);
  // }, [zoomSettings.zoomReset]);

  useEffect(() => {
    if (operation !== Tool.Zoom) return;

    if (!operator) return;
    // @ts-ignore
    operator.mode = zoomSettings.zoomMode;
  }, [zoomSettings.zoomMode]);

  useEffect(() => {
    if (operation !== Tool.Zoom) return;

    if (!operator) return;
    // @ts-ignore
    operator.center = zoomSettings.zoomAutomaticCentering;
  }, [zoomSettings.zoomAutomaticCentering]);

  return operator;

  // return {
  //   onWheel: operator ? operator.onWheel: () => {},
  //   onZoomMouseDown: operator ? operator.onMouseDown : () => {},
  //   scale: operator ? operator.scale: 1,
  //   x: operator ? operator.x : 0,
  //   y: operator ? operator.y: 0
  // }
};
