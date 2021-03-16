import { State } from "../../types/State";
import { ToolType } from "../../types/ToolType";

export const toolTypeSelector = ({ state }: { state: State }): ToolType => {
  return state.toolType;
};
