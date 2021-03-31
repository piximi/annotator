import { StateType } from "../../types/StateType";

export const boundingClientRectWidthSelector = ({
  state,
}: {
  state: StateType;
}) => {
  return state.boundingClientRectWidth;
};
