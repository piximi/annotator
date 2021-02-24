import { ImageViewerState } from "../../types/ImageViewerState";

export const imageInstancesSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.image?.instances;
};
