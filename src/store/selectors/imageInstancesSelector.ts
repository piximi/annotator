import { State } from "../../types/State";

export const imageInstancesSelector = ({ state }: { state: State }) => {
  return state.image?.instances;
};
