import React from 'react';
import ReactDOM from 'react-dom';
import theme from './theme';
import './index.css';
import App from './App';
import 'typeface-roboto'
// Layout
import { ThemeProvider } from '@mui/material/styles';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
