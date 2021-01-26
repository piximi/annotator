import { ImageViewerState } from "../../types/ImageViewerState";

export const imageViewerImageInstancesSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.image?.instances;
};
