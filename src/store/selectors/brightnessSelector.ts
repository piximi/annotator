import { State } from "../../types/ImageViewerState";

export const brightnessSelector = ({ state }: { state: State }) => {
  return state.brightness;
};
