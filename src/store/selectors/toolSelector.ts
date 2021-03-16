import { State } from "../../types/State";
import { Tool } from "../../types/Tool";

export const toolSelector = ({ state }: { state: State }): Tool => {
  return state.tool;
};
