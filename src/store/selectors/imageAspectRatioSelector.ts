import { HistoryStateType } from "../../types/HistoryStateType";

export const imageAspectRatioSelector = ({
  state,
}: {
  state: HistoryStateType;
}) => {
  if (!state.present.image || !state.present.image.shape) return;

  return state.present.image.shape.height / state.present.image.shape.width;
};
