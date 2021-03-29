import { State } from "../../types/State";
import { Category } from "../../types/Category";

export const unknownCategorySelector = ({ state }: { state: State }) => {
  return state.categories.find((category: Category) => {
    return category.id === "00000000-0000-0000-0000-000000000000";
  })!;
};
