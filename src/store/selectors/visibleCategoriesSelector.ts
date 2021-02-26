import { State } from "../../types/State";

export const visibleCategoriesSelector = ({ state }: { state: State }) => {
  return state.categories
    .filter((category) => category.visible)
    .map((category) => {
      return category.id;
    });
};
