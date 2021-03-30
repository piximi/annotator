import { StateType } from "../../types/StateType";

export const soundEnabledSelector = ({ state }: { state: StateType }) => {
  return state.soundEnabled;
};
