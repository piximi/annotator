import { ImageViewerState } from "../../types/ImageViewerState";
import { ImageViewerZoomMode } from "../../types/ImageViewerZoomMode";

export const zoomModeSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}): ImageViewerZoomMode => {
  return imageViewer.zoomMode;
};
