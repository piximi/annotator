import { StateType } from "../../types/StateType";

export const contrastSelector = ({ state }: { state: StateType }) => {
  return state.present.contrast;
};
