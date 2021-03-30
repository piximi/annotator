import { StateType } from "../../types/StateType";

export const stageHeightSelector = ({
  state,
}: {
  state: StateType;
}): number => {
  return state.stageHeight;
};
