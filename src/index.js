import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import omni from './model/Omni'
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(omni);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root'));
registerServiceWorker();
