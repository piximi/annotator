import { HistoryStateType } from "../../types/HistoryStateType";

export const intensityRangeSelector = ({
  state,
}: {
  state: HistoryStateType;
}): {
  red: Array<number>;
  green: Array<number>;
  blue: Array<number>;
} => {
  return state.present.intensityRange;
};
