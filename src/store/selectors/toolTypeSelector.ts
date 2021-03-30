import { StateType } from "../../types/StateType";
import { ToolType } from "../../types/ToolType";

export const toolTypeSelector = ({ state }: { state: StateType }): ToolType => {
  return state.toolType;
};
