import { StateType } from "../../types/StateType";

export const saturationSelector = ({ state }: { state: StateType }) => {
  return state.present.saturation;
};
