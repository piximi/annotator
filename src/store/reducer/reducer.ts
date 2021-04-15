import { combineReducers } from "redux";
import { applicationSlice } from "../slices";
import { toolOptionsSlice } from "../slices/toolOptionsSlice";
import undoable from "redux-undo";

const reducers = {
  state: undoable(applicationSlice.reducer),
  toolOptions: toolOptionsSlice.reducer,
};

export const reducer = combineReducers(reducers);
