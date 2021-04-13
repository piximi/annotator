import { StateType } from "./StateType";

export type HistoryStateType = {
  past: Array<StateType>;
  present: StateType;
  future: Array<StateType>;
};
