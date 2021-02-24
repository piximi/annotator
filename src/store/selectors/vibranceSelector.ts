import { ImageViewerState } from "../../types/ImageViewerState";

export const vibranceSelector = ({ state }: { state: ImageViewerState }) => {
  return state.vibrance;
};
