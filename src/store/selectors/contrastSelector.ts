import { ImageViewerState } from "../../types/ImageViewerState";

export const contrastSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.contrast;
};
