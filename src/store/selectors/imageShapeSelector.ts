import { HistoryStateType } from "../../types/HistoryStateType";

export const imageShapeSelector = ({ state }: { state: HistoryStateType }) => {
  if (!state.present.image) return;

  return state.present.image.shape;
};
