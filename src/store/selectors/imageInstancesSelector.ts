import { StateType } from "../../types/StateType";

export const imageInstancesSelector = ({ state }: { state: StateType }) => {
  return state.present.image?.annotations;
};
