import { ImageViewerState } from "../../types/ImageViewerState";

export const exposureSelector = ({ state }: { state: ImageViewerState }) => {
  return state.exposure;
};
