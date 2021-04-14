import { HistoryStateType } from "../../types/HistoryStateType";

export const imageSelector = ({ state }: { state: HistoryStateType }) => {
  return state.present.image;
};
