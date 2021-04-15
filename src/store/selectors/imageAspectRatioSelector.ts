import { StateType } from "../../types/StateType";

export const imageAspectRatioSelector = ({ state }: { state: StateType }) => {
  if (!state.present.image || !state.present.image.shape) return;

  return state.present.image.shape.height / state.present.image.shape.width;
};
