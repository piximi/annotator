import { StateType } from "../../types/StateType";

export const brightnessSelector = ({ state }: { state: StateType }) => {
  return state.brightness;
};
