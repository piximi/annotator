import { ToolType } from "../../types/ToolType";
import { KonvaEventObject } from "konva/types/Node";
import { setSelectedAnnotation, setSeletedCategory } from "../../store/slices";
import { useDispatch } from "react-redux";
import { Selection } from "../../types/Selection";

export const usePointerOperator = (operation: ToolType) => {
  const dispatch = useDispatch();

  const onPointerClick = (
    event: KonvaEventObject<MouseEvent>,
    annotation: Selection
  ) => {
    if (operation !== ToolType.Pointer) return;

    dispatch(
      setSeletedCategory({
        selectedCategory: annotation.categoryId,
      })
    );

    dispatch(
      setSelectedAnnotation({
        selectedAnnotation: annotation.id,
      })
    );
  };

  return {
    onPointerClick: onPointerClick,
  };
};
