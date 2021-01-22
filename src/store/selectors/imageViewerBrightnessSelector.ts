import { ImageViewerState } from "../../types/ImageViewerState";

export const imageViewerBrightnessSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.brightness;
};
