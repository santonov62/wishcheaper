import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './assets/css/app.css';
import App from './App';
import moment from 'moment';
import ru from 'moment/locale/ru.js';
import io from 'socket.io-client';

moment.updateLocale('ru', ru);
console.log(moment.locale());

// let host = window.location.origin.replace(/^http/, 'ws');
// if (!!process.env.REACT_APP_DEV_SOCKET_PORT)
//   host = host.replace(/:3000/, `:${process.env.REACT_APP_DEV_SOCKET_PORT}`);
//
// window.ws = io(host);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// registerServiceWorker();
