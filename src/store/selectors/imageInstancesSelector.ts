import { State } from "../../types/ImageViewerState";

export const imageInstancesSelector = ({ state }: { state: State }) => {
  return state.image?.instances;
};
