import { HistoryStateType } from "../../types/HistoryStateType";

export const intensityRangeSelector = ({
  state,
}: {
  state: HistoryStateType;
}): {
  red: { min: number; max: number };
  green: { min: number; max: number };
  blue: { min: number; max: number };
} => {
  return state.present.intensityRange;
};
