import { HistoryStateType } from "../../types/HistoryStateType";

export const currentPositionSelector = ({
  state,
}: {
  state: HistoryStateType;
}) => {
  return state.present.currentPosition;
};
