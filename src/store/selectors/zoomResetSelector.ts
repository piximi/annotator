import { State } from "../../types/State";

export const zoomResetSelector = ({ state }: { state: State }) => {
  return state.zoomReset;
};
