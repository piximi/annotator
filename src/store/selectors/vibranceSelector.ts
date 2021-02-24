import { ImageViewerState } from "../../types/ImageViewerState";

export const vibranceSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.vibrance;
};
