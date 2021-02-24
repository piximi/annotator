import { ImageViewerState } from "../../types/ImageViewerState";

export const brightnessSelector = ({ state }: { state: ImageViewerState }) => {
  return state.brightness;
};
