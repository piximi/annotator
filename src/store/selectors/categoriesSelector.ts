import { State } from "../../types/State";

export const categoriesSelector = ({ state }: { state: State }) => {
  return state.categories;
};
