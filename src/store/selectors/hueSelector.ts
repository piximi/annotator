import { State } from "../../types/State";

export const hueSelector = ({ state }: { state: State }) => {
  return state.hue;
};
