import { combineReducers } from "redux";
import { applicationSlice } from "../slices";
import { toolOptionsSlice } from "../slices/toolOptionsSlice";

const reducers = {
  state: applicationSlice.reducer,
  toolOptions: toolOptionsSlice.reducer,
};

export const reducer = combineReducers(reducers);
