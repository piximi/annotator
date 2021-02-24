import { ImageViewerState } from "../../types/ImageViewerState";

export const saturationSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.saturation;
};
