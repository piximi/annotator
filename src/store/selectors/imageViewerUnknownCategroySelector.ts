import { ImageViewerState } from "../../types/ImageViewerState";
import * as _ from "lodash";
import { Category } from "../../types/Category";

export const imageViewerUnknownCategroySelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  const category = _.find(imageViewer.categories, (category: Category) => {
    return category.id === "00000000-0000-0000-0000-000000000000";
  });

  return category!;
};
