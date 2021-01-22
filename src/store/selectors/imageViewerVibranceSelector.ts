import { ImageViewerState } from "../../types/ImageViewerState";

export const imageViewerVibranceSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.vibrance;
};
