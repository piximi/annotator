import { ImageViewerState } from "../../types/ImageViewerState";
import { ImageViewerZoomMode } from "../../types/ImageViewerZoomMode";

export const zoomModeSelector = ({
  state,
}: {
  state: ImageViewerState;
}): ImageViewerZoomMode => {
  return state.zoomMode;
};
