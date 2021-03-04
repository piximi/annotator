import { State } from "../../types/State";

export const invertModeSelector = ({ state }: { state: State }): boolean => {
  return state.invertMode;
};
