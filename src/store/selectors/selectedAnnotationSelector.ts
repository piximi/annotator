import { StateType } from "../../types/StateType";

export const selectedAnnotationSelector = ({
  state,
}: {
  state: StateType;
}): string | undefined => {
  return state.selectedAnnotation;
};
