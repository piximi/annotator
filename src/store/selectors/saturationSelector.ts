import { ImageViewerState } from "../../types/ImageViewerState";

export const saturationSelector = ({ state }: { state: ImageViewerState }) => {
  return state.saturation;
};
