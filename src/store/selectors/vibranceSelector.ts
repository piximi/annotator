import { StateType } from "../../types/StateType";

export const vibranceSelector = ({ state }: { state: StateType }) => {
  return state.present.vibrance;
};
