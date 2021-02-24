import { ImageViewerState } from "../../types/ImageViewerState";
import { Category } from "../../types/Category";

export const unknownCategroySelector = ({
  state,
}: {
  state: ImageViewerState;
}) => {
  return state.categories.find((category: Category) => {
    return category.id === "00000000-0000-0000-0000-000000000000";
  })!;
};
