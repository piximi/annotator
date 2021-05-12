import { HistoryStateType } from "../../types/HistoryStateType";

export const intensityRangeSelector = ({
  state,
}: {
  state: HistoryStateType;
}): Array<Array<number>> => {
  return state.present.intensityRange;
};
