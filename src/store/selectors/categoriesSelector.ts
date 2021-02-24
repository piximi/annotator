import { ImageViewerState } from "../../types/ImageViewerState";

export const categoriesSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.categories;
};
