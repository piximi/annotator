import { StateType } from "../../types/StateType";

export const categoriesSelector = ({ state }: { state: StateType }) => {
  return state.present.categories;
};
