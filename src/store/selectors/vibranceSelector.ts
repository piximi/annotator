import { State } from "../../types/State";

export const vibranceSelector = ({ state }: { state: State }) => {
  return state.vibrance;
};
