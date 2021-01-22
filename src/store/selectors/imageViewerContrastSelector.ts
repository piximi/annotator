import { ImageViewerState } from "../../types/ImageViewerState";

export const imageViewerContrastSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.contrast;
};
