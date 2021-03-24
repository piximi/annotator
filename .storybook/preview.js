import {Provider} from "react-redux";
import React from "react";
import {store} from "../src/store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const decorators = [
  (Story) => (
      <Provider store={store}>
          <DndProvider backend={HTML5Backend}>
        <Story />
          </DndProvider>
      </Provider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
