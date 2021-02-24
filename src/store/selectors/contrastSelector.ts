import { ImageViewerState } from "../../types/ImageViewerState";

export const contrastSelector = ({ state }: { state: ImageViewerState }) => {
  return state.contrast;
};
