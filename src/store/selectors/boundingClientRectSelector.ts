import { StateType } from "../../types/StateType";

export const boundingClientRectSelector = ({ state }: { state: StateType }) => {
  return state.boundingClientRect;
};
