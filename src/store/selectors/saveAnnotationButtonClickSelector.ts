import { HistoryStateType } from "../../types/HistoryStateType";

export const saveAnnotationButtonClickSelector = ({
  state,
}: {
  state: HistoryStateType;
}) => {
  return state.present.saveAnnotationButtonClick;
};
