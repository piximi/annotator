import { State } from "../../types/ImageViewerState";
import { SelectionMode } from "../../types/ImageViewerSelectionMode";

export const selectionModeSelector = ({
  state,
}: {
  state: State;
}): SelectionMode => {
  return state.selectionMode;
};
