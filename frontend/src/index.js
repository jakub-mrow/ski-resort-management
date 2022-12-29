import React from 'react';
import ReactDOM  from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

import './index.css'
import App from './App';
import { ContextProvider } from './context/ContextProvider';


const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(
    <ContextProvider><App/></ContextProvider>
);