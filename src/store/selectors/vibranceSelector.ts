import { State } from "../../types/ImageViewerState";

export const vibranceSelector = ({ state }: { state: State }) => {
  return state.vibrance;
};
