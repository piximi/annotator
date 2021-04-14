import { useHotkeys } from "../useHotkeys";
import { useDispatch, useSelector } from "react-redux";
import { setOperation, setSeletedCategory } from "../../store";
import { ToolType } from "../../types/ToolType";
import {
  createdCategoriesSelector,
  toolTypeSelector,
} from "../../store/selectors";

export const useKeyboardShortcuts = () => {
  const dispatch = useDispatch();

  const categories = useSelector(createdCategoriesSelector);
  const toolType = useSelector(toolTypeSelector);

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

  /*
   * Select category (1-9)
   */
  useHotkeys("1,2,3,4,5,6,7,8,9", (event: KeyboardEvent) => {
    const index = parseInt(event.key) - 1;

    const selectedCategory = categories[index];

    if (!selectedCategory) return;

    dispatch(setSeletedCategory({ selectedCategory: selectedCategory.id }));
  });

  /*
   * Select color tool (W)
   */
  useHotkeys("w", () => {
    dispatch(setOperation({ operation: ToolType.ColorAnnotation }));
  });

  /*
   * Select hand tool (H)
   */
  useHotkeys("h", () => {
    dispatch(setOperation({ operation: ToolType.Hand }));
  });

  /*
   * Select lasso tool (L)
   */
  useHotkeys("l", () => {
    dispatch(setOperation({ operation: ToolType.LassoAnnotation }));
  });

  /*
   * Select pencil tool (P)
   */
  useHotkeys("p", () => {
    dispatch(setOperation({ operation: ToolType.PenAnnotation }));
  });

  /*
   * Select rectangular tool (M)
   */
  useHotkeys("m", () => {
    dispatch(setOperation({ operation: ToolType.RectangularAnnotation }));
  });

  /*
   * Select zoom tool (Z)
   */
  useHotkeys("z", () => {
    dispatch(setOperation({ operation: ToolType.Zoom }));
  });
};
