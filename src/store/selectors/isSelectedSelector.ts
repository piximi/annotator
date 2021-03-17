import { State } from "../../types/State";

export const isSelectedSelector = ({ state }: { state: State }): boolean => {
  return state.isSelected;
};
