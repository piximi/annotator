import {Provider} from "react-redux";
import React from "react";
import {store} from "../src/store";

export const decorators = [
  (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
