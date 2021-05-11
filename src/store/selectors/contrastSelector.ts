import { HistoryStateType } from "../../types/HistoryStateType";

export const contrastSelector = ({
  state,
}: {
  state: HistoryStateType;
}): { min: number; max: number } | undefined => {
  return state.present.contrast;
};
