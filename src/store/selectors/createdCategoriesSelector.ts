import { ImageViewerState } from "../../types/ImageViewerState";
import { Category } from "../../types/Category";
import { sortBy } from "underscore";

export const createdCategoriesSelector = ({
  imageViewer,
}: {
  imageViewer: ImageViewerState;
}) => {
  const categories = imageViewer.categories.filter((category: Category) => {
    return category.id !== "00000000-0000-0000-0000-000000000000";
  });

  return sortBy(categories, "name");
};
