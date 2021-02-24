import { ImageViewerState } from "../../types/ImageViewerState";

export const imageInstancesSelector = ({
  state,
}: {
  state: ImageViewerState;
}) => {
  return state.image?.instances;
};
