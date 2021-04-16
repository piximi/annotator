import { HistoryStateType } from "../../types/HistoryStateType";

export const selectedAnnotationsIdsSelector = ({
  state,
}: {
  state: HistoryStateType;
}): Array<string> => {
  return state.present.selectedAnnotationsIds;
};
