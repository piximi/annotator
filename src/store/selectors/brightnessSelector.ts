import { ImageViewerState } from "../../types/ImageViewerState";

export const brightnessSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.brightness;
};
