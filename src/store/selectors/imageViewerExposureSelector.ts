import { ImageViewerState } from "../../types/ImageViewerState";

export const imageViewerExposureSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.exposure;
};
