import { ImageViewerState } from "../../types/ImageViewerState";

export const imageViewerHueSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.hue;
};
