import { ImageViewerState } from "../../types/ImageViewerState";

export const imageViewerCategoriesSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return imageViewer.categories;
};
