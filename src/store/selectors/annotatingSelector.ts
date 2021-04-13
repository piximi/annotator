import { StateType } from "../../types/StateType";

export const annotatingSelector = ({
  state,
}: {
  state: StateType;
}): boolean => {
  return state.annotating;
};
