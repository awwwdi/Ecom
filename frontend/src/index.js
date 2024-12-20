import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import store from './store/store';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CssBaseline />
      <App />
    </Provider>
  </React.StrictMode>
);