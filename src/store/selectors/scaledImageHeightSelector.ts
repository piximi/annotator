import { HistoryStateType } from "../../types/HistoryStateType";

export const scaledImageHeightSelector = ({
  state,
}: {
  state: HistoryStateType;
}) => {
  if (!state.present.image) return;

  return state.present.image.shape.height * state.present.stageScale;
};
