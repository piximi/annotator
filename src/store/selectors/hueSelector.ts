import { ImageViewerState } from "../../types/ImageViewerState";

export const hueSelector = ({ state }: { state: ImageViewerState }) => {
  return state.hue;
};
