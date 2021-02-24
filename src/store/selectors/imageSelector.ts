import { ImageViewerState } from "../../types/ImageViewerState";

export const imageSelector = ({ state }: { state: ImageViewerState }) => {
  return state.image;
};
