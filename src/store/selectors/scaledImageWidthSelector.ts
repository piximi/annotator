import { HistoryStateType } from "../../types/HistoryStateType";

export const scaledImageWidthSelector = ({
  state,
}: {
  state: HistoryStateType;
}) => {
  if (!state.present.image) return;

  return state.present.image.shape.width * state.present.stageScale;
};
