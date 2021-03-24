import { State } from "../../types/State";

export const imageNameSelector = ({ state }: { state: State }) => {
  if (!state.image) return;

  return state.image.name;
};
