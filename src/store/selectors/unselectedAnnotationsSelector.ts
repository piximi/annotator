import { HistoryStateType } from "../../types/HistoryStateType";
import { AnnotationType } from "../../types/AnnotationType";

export const unselectedAnnotationsSelector = ({
  state,
}: {
  state: HistoryStateType;
}): Array<AnnotationType> => {
  if (!state.present.image) return [];

  const ids = state.present.selectedAnnotations.map(
    (annotation: AnnotationType) => {
      return annotation.id;
    }
  );

  return state.present.image.annotations.filter(
    (annotation: AnnotationType) => {
      return !ids.includes(annotation.id);
    }
  );
};
