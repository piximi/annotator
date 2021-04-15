import { StateType } from "../../types/StateType";

export const imageHeightSelector = ({ state }: { state: StateType }) => {
  if (!state.present.image) return;

  return state.present.image.shape.height * state.present.stageScale;
};
