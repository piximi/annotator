import { StateType } from "../../types/StateType";
import { AnnotationModeType } from "../../types/AnnotationModeType";

export const selectionModeSelector = ({
  state,
}: {
  state: StateType;
}): AnnotationModeType => {
  return state.selectionMode;
};
