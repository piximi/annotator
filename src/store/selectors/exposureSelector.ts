import { State } from "../../types/ImageViewerState";

export const exposureSelector = ({ state }: { state: State }) => {
  return state.exposure;
};
