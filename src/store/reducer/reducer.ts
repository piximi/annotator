import { combineReducers } from "redux";
import { applicationSlice } from "../slices";

const reducers = {
  state: applicationSlice.reducer,
};

export const reducer = combineReducers(reducers);
