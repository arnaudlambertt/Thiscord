import React from 'react';
import ReactDOM from 'react-dom';
import theme from './theme';
import { CookiesProvider } from 'react-cookie';
import './index.css';
import App from './App';
import 'typeface-roboto'
// Layout
import { ThemeProvider } from '@mui/material/styles';

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
