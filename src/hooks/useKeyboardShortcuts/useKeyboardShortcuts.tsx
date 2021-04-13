import { useHotkeys } from "../useHotkeys";
import { useDispatch } from "react-redux";
import { setOperation } from "../../store";
import { ToolType } from "../../types/ToolType";

export const useKeyboardShortcuts = () => {
  const dispatch = useDispatch();

  /*
   * Color (W)
   */
  useHotkeys("w", () => {
    dispatch(setOperation({ operation: ToolType.ColorAnnotation }));
  });

  /*
   * Lasso (L)
   */
  useHotkeys("l", () => {
    dispatch(setOperation({ operation: ToolType.LassoAnnotation }));
  });

  /*
   * Pencil (P)
   */
  useHotkeys("p", () => {
    dispatch(setOperation({ operation: ToolType.PenAnnotation }));
  });

  /*
   * Rectangular (M)
   */
  useHotkeys("m", () => {
    dispatch(setOperation({ operation: ToolType.RectangularAnnotation }));
  });

  /*
   * Zoom (Z)
   */
  useHotkeys("z", () => {
    dispatch(setOperation({ operation: ToolType.Zoom }));
  });
};
