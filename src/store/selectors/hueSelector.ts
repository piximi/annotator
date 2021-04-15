import { StateType } from "../../types/StateType";

export const hueSelector = ({ state }: { state: StateType }) => {
  return state.present.hue;
};
