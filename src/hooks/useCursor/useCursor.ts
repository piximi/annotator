import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toolTypeSelector } from "../../store/selectors";
import { ToolType } from "../../types/ToolType";

export const useCursor = () => {
  const [cursor, setCursor] = useState<string>();

  const toolType = useSelector(toolTypeSelector);

  useEffect(() => {
    switch (toolType) {
      case ToolType.EllipticalAnnotation:
        setCursor("crosshair");

        break;
      case ToolType.PenAnnotation:
        setCursor("none");

        break;
      case ToolType.RectangularAnnotation:
        setCursor("crosshair");

        break;
      default:
        setCursor("pointer");

        break;
    }
  }, [toolType]);

  return { cursor };
};
