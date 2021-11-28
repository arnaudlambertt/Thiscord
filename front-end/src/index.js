import React from 'react';
import ReactDOM from 'react-dom';
import theme from './theme';
import {CookiesProvider} from 'react-cookie';
import {ContextProvider} from './Context'
import {BrowserRouter as Router} from "react-router-dom";

import './index.css';
import App from './App';
import 'typeface-roboto'
// Layout
import { ThemeProvider } from '@mui/material/styles';

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <CookiesProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <App />
          </Router>
        </ThemeProvider>
      </CookiesProvider>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
