import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import { ConnectedRouter } from 'connected-react-router';
import { App } from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';
import './index.scss';
import { history } from './store/reducers';

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
