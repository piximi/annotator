import { StateType } from "../../types/StateType";

export const imageWidthSelector = ({ state }: { state: StateType }) => {
  if (!state.present.image) return;

  return state.present.image.shape.width * state.present.stageScale;
};
