import { ImageViewerState } from "../../types/ImageViewerState";
import { ImageViewerSelectionMode } from "../../types/ImageViewerSelectionMode";

export const selectionModeSelector = ({
  state,
}: {
  state: ImageViewerState;
}): ImageViewerSelectionMode => {
  return state.selectionMode;
};
