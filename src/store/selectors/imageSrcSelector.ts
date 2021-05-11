import { HistoryStateType } from "../../types/HistoryStateType";

export const imageSrcSelector = ({ state }: { state: HistoryStateType }) => {
  const image = state.present.image;

  if (!image) return;

  return image.displayedSrc;
};
