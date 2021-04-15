import { StateType } from "../../types/StateType";
import * as _ from "lodash";
import { CategoryType } from "../../types/CategoryType";

export const selectedCategroySelector = ({
  state,
}: {
  state: StateType;
}): CategoryType => {
  const category = _.find(
    state.present.categories,
    (category: CategoryType) => {
      return category.id === state.present.selectedCategory;
    }
  );

  return category!;
};
