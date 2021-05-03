import { HistoryStateType } from "../../types/HistoryStateType";

export const imageWidthSelector = ({ state }: { state: HistoryStateType }) => {
  if (!state.present.image) return;
  return state.present.image.shape.width;
};
