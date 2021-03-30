import { StateType } from "../../types/StateType";

export const imageNameSelector = ({ state }: { state: StateType }) => {
  if (!state.image) return;

  return state.image.name;
};
