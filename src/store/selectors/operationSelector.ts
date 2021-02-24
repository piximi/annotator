import { State } from "../../types/State";
import { Operation } from "../../types/Operation";

export const operationSelector = ({ state }: { state: State }): Operation => {
  return state.operation;
};
