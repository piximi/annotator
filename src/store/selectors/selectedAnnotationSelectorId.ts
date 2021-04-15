import { HistoryStateType } from "../../types/HistoryStateType";

export const selectedAnnotationSelectorId = ({
  state,
}: {
  state: HistoryStateType;
}): string | undefined => {
  return state.present.selectedAnnotationId;
};
