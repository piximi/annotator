import { StateType } from "../../types/StateType";

export const stageScaleSelector = ({ state }: { state: StateType }): number => {
  return state.present.stageScale;
};
