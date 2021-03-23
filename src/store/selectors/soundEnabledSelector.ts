import { State } from "../../types/State";

export const soundEnabledSelector = ({ state }: { state: State }) => {
  return state.soundEnabled;
};
