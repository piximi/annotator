import { HistoryStateType } from "../../types/HistoryStateType";

export const imageNameSelector = ({ state }: { state: HistoryStateType }) => {
  if (!state.present.image) return;

  return state.present.image.name;
};
