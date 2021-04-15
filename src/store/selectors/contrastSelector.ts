import { HistoryStateType } from "../../types/HistoryStateType";

export const contrastSelector = ({ state }: { state: HistoryStateType }) => {
  return state.present.contrast;
};
