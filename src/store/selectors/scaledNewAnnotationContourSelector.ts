import { HistoryStateType } from "../../types/HistoryStateType";
import { AnnotationType } from "../../types/AnnotationType";

export const scaledNewAnnotationContourSelector = ({
  state,
}: {
  state: HistoryStateType;
}): Array<number> | undefined => {
  const stageScale = state.present.stageScale;
  if (!state.present.newAnnotation) return;
  return state.present.newAnnotation.contour.map((point: number) => {
    return point * stageScale;
  });
};
