import { HistoryStateType } from "../../types/HistoryStateType";
import { AnnotationType } from "../../types/AnnotationType";

export const unselectedAnnotationsSelector = ({
  state,
}: {
  state: HistoryStateType;
}): Array<AnnotationType> => {
  return state.present.selectedAnnotations.filter(
    (annotation: AnnotationType) => {
      return annotation.id !== state.present.selectedAnnotationId;
    }
  );
};
