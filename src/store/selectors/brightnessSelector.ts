import { State } from "../../types/State";

export const brightnessSelector = ({ state }: { state: State }) => {
  return state.brightness;
};
