import { StateType } from "../../types/StateType";

export const stageWidthSelector = ({ state }: { state: StateType }): number => {
  return state.stageWidth;
};
