import { State } from "../../types/State";

export const saturationSelector = ({ state }: { state: State }) => {
  return state.saturation;
};
