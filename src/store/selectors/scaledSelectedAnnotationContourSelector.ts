import { HistoryStateType } from "../../types/HistoryStateType";
import { AnnotationType } from "../../types/AnnotationType";

export const scaledSelectedAnnotationContourSelector = ({
  state,
}: {
  state: HistoryStateType;
}): Array<number> | undefined => {
  const stageScale = state.present.stageScale;
  if (!state.present.selectedAnnotation) return;
  return state.present.selectedAnnotation.contour.map((point: number) => {
    return point * stageScale;
  });
};
