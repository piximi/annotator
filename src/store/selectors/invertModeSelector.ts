import { State } from "../../types/State";
import { SelectionMode } from "../../types/SelectionMode";

export const selectionModeSelector = ({
  state,
}: {
  state: State;
}): SelectionMode => {
  return state.selectionMode;
};
