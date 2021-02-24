import { State } from "../../types/State";

export const exposureSelector = ({ state }: { state: State }) => {
  return state.exposure;
};
