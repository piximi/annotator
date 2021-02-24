import { ImageViewerState } from "../../types/ImageViewerState";
import * as _ from "lodash";
import { Category } from "../../types/Category";

export const selectedCategroySelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  return _.find(imageViewer.categories, (category: Category) => {
    return category.id === imageViewer.selectedCategoryId;
  })!;
};
