import { combineReducers } from "redux";
import { slice } from "../slices";

const reducers = {
  state: slice.reducer,
};

export const reducer = combineReducers(reducers);
