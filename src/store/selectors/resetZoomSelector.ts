import { State } from "../../types/State";

export const resetZoomSelector = ({ state }: { state: State }) => {
  return state.resetZoom;
};
