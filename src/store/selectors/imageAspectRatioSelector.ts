import { StateType } from "../../types/StateType";

export const imageAspectRatioSelector = ({ state }: { state: StateType }) => {
  if (!state.image || !state.image.shape) return;

  return state.image.shape.height / state.image.shape.width;
};
