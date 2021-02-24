import {
  configureStore,
  EnhancedStore,
  Middleware,
  StoreEnhancer,
} from "@reduxjs/toolkit";
import logger from "redux-logger";
import { reducer } from "../reducer";

const enhancers: StoreEnhancer[] = [];

const middleware: Middleware[] = [logger];

const preloadedState = {};

const options = {
  devTools: true,
  enhancers: enhancers,
  middleware: middleware,
  preloadedState: preloadedState,
  reducer: reducer,
};

export const productionStore: EnhancedStore = configureStore(options);
