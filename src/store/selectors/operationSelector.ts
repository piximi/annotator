import { ImageViewerState } from "../../types/ImageViewerState";
import { ImageViewerOperation } from "../../types/ImageViewerOperation";

export const operationSelector = ({
  state,
}: {
  state: ImageViewerState;
}): ImageViewerOperation => {
  return state.operation;
};
