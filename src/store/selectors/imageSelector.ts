import { ImageViewerState } from "../../types/ImageViewerState";

export const imageSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.image;
};
