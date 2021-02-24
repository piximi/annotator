import { State } from "../../types/State";

export const contrastSelector = ({ state }: { state: State }) => {
  return state.contrast;
};
