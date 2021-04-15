import { StateType } from "../../types/StateType";

export const penSelectionBrushSizeSelector = ({
  state,
}: {
  state: StateType;
}) => {
  return state.present.penSelectionBrushSize;
};
