import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux'; // import Provider
import store from './store/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {' '}
      <App />
      <Toaster position="top-right" />
    </Provider>
  </React.StrictMode>
);
