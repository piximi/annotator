import { HistoryStateType } from "../../types/HistoryStateType";

export const imageOriginalSrcSelector = ({
  state,
}: {
  state: HistoryStateType;
}) => {
  const image = state.present.image;

  if (!image) return;

  return image.src;
};
