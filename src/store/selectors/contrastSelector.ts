import { State } from "../../types/ImageViewerState";

export const contrastSelector = ({ state }: { state: State }) => {
  return state.contrast;
};
