import { useEffect, useState } from "react";
import { ToolType } from "../../types/ToolType";
import { useSelector } from "react-redux";
import { toolTypeSelector } from "../../store/selectors";
import { useHotkeys } from "react-hotkeys-hook";
import { setOperation } from "../../store";

export const useHandTool = () => {
  const toolType = useSelector(toolTypeSelector);

  const [draggable, setDraggable] = useState<boolean>(false);

  useEffect(() => {
    if (toolType === ToolType.Hand) {
      setDraggable(true);
    } else {
      setDraggable(false);
    }
  }, [toolType]);

  /*
   * Temporarily select hand tool (Space)
   */
  useHotkeys("space", (event: KeyboardEvent) => {
    if (event.type === "keydown") {
      if (toolType === ToolType.Hand) return;

      setDraggable(true);
    }

    if (event.type === "keyup") {
      setDraggable(false);
    }
  });

  return { draggable };
};
