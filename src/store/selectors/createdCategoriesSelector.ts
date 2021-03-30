import { StateType } from "../../types/StateType";
import { CategoryType } from "../../types/CategoryType";
import { sortBy } from "underscore";

export const createdCategoriesSelector = ({ state }: { state: StateType }) => {
  const categories = state.categories.filter((category: CategoryType) => {
    return category.id !== "00000000-0000-0000-0000-000000000000";
  });

  return sortBy(categories, "name");
};
