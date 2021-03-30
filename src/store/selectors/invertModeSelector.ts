import { StateType } from "../../types/StateType";

export const invertModeSelector = ({
  state,
}: {
  state: StateType;
}): boolean => {
  return state.invertMode;
};
