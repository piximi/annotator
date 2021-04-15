import { StateType } from "../../types/StateType";

export const imageNameSelector = ({ state }: { state: StateType }) => {
  if (!state.present.image) return;

  return state.present.image.name;
};
