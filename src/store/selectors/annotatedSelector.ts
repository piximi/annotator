import { State } from "../../types/State";

export const annotatedSelector = ({ state }: { state: State }): boolean => {
  return state.annotated;
};
