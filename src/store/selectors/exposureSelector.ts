import { StateType } from "../../types/StateType";

export const exposureSelector = ({ state }: { state: StateType }) => {
  return state.present.exposure;
};
