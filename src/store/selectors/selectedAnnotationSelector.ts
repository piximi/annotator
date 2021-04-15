import { HistoryStateType } from "../../types/HistoryStateType";

export const selectedAnnotationSelector = ({
  state,
}: {
  state: HistoryStateType;
}): string | undefined => {
  return state.present.selectedAnnotation;
};
