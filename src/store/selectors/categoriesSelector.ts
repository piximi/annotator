import { ImageViewerState } from "../../types/ImageViewerState";

export const categoriesSelector = ({ state }: { state: ImageViewerState }) => {
  return state.categories;
};
