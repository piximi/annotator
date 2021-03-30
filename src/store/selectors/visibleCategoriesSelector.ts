import { StateType } from "../../types/StateType";

export const visibleCategoriesSelector = ({ state }: { state: StateType }) => {
  return state.categories
    .filter((category) => category.visible)
    .map((category) => {
      return category.id;
    });
};
