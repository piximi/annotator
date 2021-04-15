import { StateType } from "../../types/StateType";

export const languageSelector = ({ state }: { state: StateType }) => {
  return state.present.language;
};
