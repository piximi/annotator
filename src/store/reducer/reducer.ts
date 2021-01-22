import { combineReducers } from "redux";
import {
  imageViewerSlice,
  projectSlice,
} from "../slices";

const reducers = {
  imageViewer: imageViewerSlice.reducer,
  project: projectSlice.reducer,
};

export const reducer = combineReducers(reducers);
