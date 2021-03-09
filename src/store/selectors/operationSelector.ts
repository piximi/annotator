import { State } from "../../types/State";
import { Tool } from "../../types/Tool";

export const operationSelector = ({ state }: { state: State }): Tool => {
  return state.operation;
};
