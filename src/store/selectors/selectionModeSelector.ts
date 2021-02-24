import { ImageViewerState } from "../../types/ImageViewerState";
import { ImageViewerSelectionMode } from "../../types/ImageViewerSelectionMode";

export const selectionModeSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}): ImageViewerSelectionMode => {
  return imageViewer.selectionMode;
};
