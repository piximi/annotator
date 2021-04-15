import { StateType } from "../../types/StateType";

export const imageSelector = ({ state }: { state: StateType }) => {
  return state.present.image;
};
