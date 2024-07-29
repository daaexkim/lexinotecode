import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import AppWrapper from './App';

ReactDOM.render(
  <Provider store={store}>
    <AppWrapper />
  </Provider>,
  document.getElementById('root')
);
