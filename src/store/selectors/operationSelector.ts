import { State } from "../../types/ImageViewerState";
import { Operation } from "../../types/ImageViewerOperation";

export const operationSelector = ({ state }: { state: State }): Operation => {
  return state.operation;
};
