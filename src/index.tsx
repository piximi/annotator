import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { ImageViewer } from "./components";
import { Provider } from "react-redux";
import { store } from "./store";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn:
    "https://c0b47db2a1b34f12b33ca8e78067617e@o71028.ingest.sentry.io/152399",
  integrations: [new Integrations.BrowserTracing()],
  release: "image-viewer@" + process.env.npm_package_version,
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ImageViewer />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
