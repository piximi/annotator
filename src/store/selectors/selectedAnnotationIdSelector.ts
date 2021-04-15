import { HistoryStateType } from "../../types/HistoryStateType";

export const selectedAnnotationIdSelector = ({
  state,
}: {
  state: HistoryStateType;
}): string | undefined => {
  return state.present.selectedAnnotationId;
};
