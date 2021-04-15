import { StateType } from "../../types/StateType";
import { CategoryType } from "../../types/CategoryType";

export const unknownCategorySelector = ({ state }: { state: StateType }) => {
  return state.present.categories.find((category: CategoryType) => {
    return category.id === "00000000-0000-0000-0000-000000000000";
  })!;
};
