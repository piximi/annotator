import { State } from "../../types/ImageViewerState";

export const hueSelector = ({ state }: { state: State }) => {
  return state.hue;
};
