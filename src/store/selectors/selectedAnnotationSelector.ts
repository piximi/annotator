import { State } from "../../types/State";

export const selectedAnnotationSelector = ({
  state,
}: {
  state: State;
}): string | undefined => {
  return state.selectedAnnotation;
};
