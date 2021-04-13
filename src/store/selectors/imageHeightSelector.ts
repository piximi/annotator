import { StateType } from "../../types/StateType";

export const imageHeightSelector = ({ state }: { state: StateType }) => {
  if (!state.image) return;

  return state.image.shape.height * state.stageScale;
};
