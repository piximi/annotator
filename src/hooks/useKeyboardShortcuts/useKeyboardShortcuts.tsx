import { useHotkeys } from "../useHotkeys";
import { useDispatch, useSelector } from "react-redux";
import { setOperation } from "../../store";
import { ToolType } from "../../types/ToolType";
import { toolTypeSelector } from "../../store/selectors";

export const useKeyboardShortcuts = () => {
  const dispatch = useDispatch();

  const toolType = useSelector(toolTypeSelector);

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

  /*
   * Cycle marquee tools (Shift + M)
   */
  useHotkeys(
    "shift+m",
    () => {
      switch (toolType) {
        case ToolType.EllipticalAnnotation:
          dispatch(setOperation({ operation: ToolType.RectangularAnnotation }));

          break;
        case ToolType.RectangularAnnotation:
          dispatch(setOperation({ operation: ToolType.EllipticalAnnotation }));

          break;
        default:
          dispatch(setOperation({ operation: ToolType.RectangularAnnotation }));

          break;
      }
    },
    [toolType]
  );

  /*
   * Cycle lasso tools (Shift + L)
   */
  useHotkeys(
    "shift+l",
    () => {
      switch (toolType) {
        case ToolType.LassoAnnotation:
          dispatch(setOperation({ operation: ToolType.MagneticAnnotation }));

          break;
        case ToolType.MagneticAnnotation:
          dispatch(setOperation({ operation: ToolType.PolygonalAnnotation }));

          break;
        case ToolType.PolygonalAnnotation:
          dispatch(setOperation({ operation: ToolType.LassoAnnotation }));

          break;
        default:
          dispatch(setOperation({ operation: ToolType.LassoAnnotation }));

          break;
      }
    },
    [toolType]
  );

  /*
   * Cycle learning-based tools (Shift + W)
   */
  useHotkeys(
    "shift+w",
    () => {
      switch (toolType) {
        case ToolType.ColorAnnotation:
          dispatch(setOperation({ operation: ToolType.ObjectAnnotation }));

          break;
        case ToolType.ObjectAnnotation:
          dispatch(setOperation({ operation: ToolType.QuickAnnotation }));

          break;
        case ToolType.QuickAnnotation:
          dispatch(setOperation({ operation: ToolType.ColorAnnotation }));

          break;
        default:
          dispatch(setOperation({ operation: ToolType.ColorAnnotation }));

          break;
      }
    },
    [toolType]
  );
};
