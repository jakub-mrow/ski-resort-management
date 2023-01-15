import React from 'react';
import ReactDOM  from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

import './index.css'
import App from './App';
import { ContextProvider } from './context/ContextProvider';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { enUS } from '@mui/material/locale';


const theme = createTheme(
    enUS
  );


const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider theme={theme}>
        <ContextProvider>
            <App/>
        </ContextProvider>
    </ThemeProvider>
);