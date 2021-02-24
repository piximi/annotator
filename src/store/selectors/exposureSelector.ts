import { ImageViewerState } from "../../types/ImageViewerState";

export const exposureSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.exposure;
};
