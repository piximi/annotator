import { ImageViewerState } from "../../types/ImageViewerState";

export const hueSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.hue;
};
