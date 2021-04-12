import { StateType } from "../../types/StateType";

export const imageWidthSelector = ({ state }: { state: StateType }) => {
  if (!state.image) return;

  return state.image.shape.width * state.stageScale;
};
