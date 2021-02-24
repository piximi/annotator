import { State } from "../../types/ImageViewerState";

export const saturationSelector = ({ state }: { state: State }) => {
  return state.saturation;
};
