import { StateType } from "../../types/StateType";
import { SelectionMode } from "../../types/SelectionMode";

export const selectionModeSelector = ({
  state,
}: {
  state: StateType;
}): SelectionMode => {
  return state.selectionMode;
};
