import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toolTypeSelector } from "../../store/selectors";
import { ToolType } from "../../types/ToolType";

export const useCursor = () => {
  const [cursor, setCursor] = useState<string>();

  const toolType = useSelector(toolTypeSelector);

  useEffect(() => {
    switch (toolType) {
      case ToolType.PenAnnotation:
        setCursor("none");

        break;
      default:
        setCursor("pointer");

        break;
    }
  }, [toolType]);

  return { cursor };
};
