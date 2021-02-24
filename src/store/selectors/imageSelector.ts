import { State } from "../../types/ImageViewerState";

export const imageSelector = ({ state }: { state: State }) => {
  return state.image;
};
