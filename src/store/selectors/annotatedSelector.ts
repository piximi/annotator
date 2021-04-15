import { StateType } from "../../types/StateType";

export const annotatedSelector = ({ state }: { state: StateType }): boolean => {
  return state.present.annotated;
};
