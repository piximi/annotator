import { StateType } from "../../types/StateType";

export const offsetSelector = ({ state }: { state: StateType }) => {
  return state.present.offset;
};
