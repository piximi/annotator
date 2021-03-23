import { State } from "../../types/State";

export const languageSelector = ({ state }: { state: State }) => {
  return state.language;
};
