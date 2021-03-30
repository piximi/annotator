import { useEffect, useReducer, useState } from "react";
import { ToolType } from "../../types/ToolType";
import { ZoomTool } from "../../image/Tool/ZoomTool";
import * as ImageJS from "image-js";
import { KonvaEventObject } from "konva/types/Node";
import { useSelector } from "react-redux";
import { zoomToolOptionsSelector } from "../../store/selectors";

export const useZoomTool = (
  aspectRatio: number,
  operation: ToolType,
  src: string,
  stageWidth: number
) => {
  const options = useSelector(zoomToolOptionsSelector);

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
      setOperator(new ZoomTool(aspectRatio, image, stageWidth));
    });
  }, [operation, src]);

  useEffect(() => {
    if (operation !== ToolType.Zoom) return;

    if (!operator) return;

    // @ts-ignore
    operator.mode = options.mode;
  }, [options.mode]);

  useEffect(() => {
    if (operation !== ToolType.Zoom) return;

    if (!operator) return;

    operator.reset();

    update();
  }, [options.toActualSize]);

  useEffect(() => {
    if (operation !== ToolType.Zoom) return;

    if (!operator) return;
    // @ts-ignore
    operator.center = options.automaticCentering;
  }, [options.automaticCentering]);

  return {
    zoomTool: operator,
    onZoomClick: onZoomClick,
    onZoomWheel: onZoomWheel,
  };
};
