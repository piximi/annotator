import { HistoryStateType } from "../../types/HistoryStateType";
import { AnnotationType } from "../../types/AnnotationType";

export const newAnnotationSelector = ({
  state,
}: {
  state: HistoryStateType;
}): AnnotationType | undefined => {
  return state.present.newAnnotation;
};
