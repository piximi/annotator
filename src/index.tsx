import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {ImageViewer} from "./components/ImageViewer";
import {Provider} from "react-redux";
import {productionStore} from "./store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={productionStore}>
      <ImageViewer/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
