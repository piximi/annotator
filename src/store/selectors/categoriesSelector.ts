import { State } from "../../types/ImageViewerState";

export const categoriesSelector = ({ state }: { state: State }) => {
  return state.categories;
};
