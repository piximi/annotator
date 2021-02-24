import { State } from "../../types/State";

export const imageSelector = ({ state }: { state: State }) => {
  return state.image;
};
