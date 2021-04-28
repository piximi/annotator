import { HistoryStateType } from "../../types/HistoryStateType";
import { AnnotationType } from "../../types/AnnotationType";

export const selectedAnnotationSelector = ({
  state,
}: {
  state: HistoryStateType;
}): AnnotationType | undefined => {
  return state.present.selectedAnnotations.filter(
    (annotation: AnnotationType) => {
      return annotation.id === state.present.selectedAnnotationId;
    }
  )[0];
};
