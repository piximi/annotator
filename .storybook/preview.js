import {Provider} from "react-redux";
import React from "react";
import {productionStore} from "../src/store";

export const decorators = [
  (Story) => (
      <Provider store={productionStore}>
        <Story />
      </Provider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
