import { ImageViewerState } from "../../types/ImageViewerState";

export const imageViewerSaturationSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.saturation;
};
