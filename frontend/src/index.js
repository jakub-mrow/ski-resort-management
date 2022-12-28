import React from 'react';
import ReactDOM  from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css'
import App from './App';
import { ContextProvider } from './context/ContextProvider';
import { Login } from './pages/';

ReactDOM.render(
    <ContextProvider><App/></ContextProvider>,
    document.getElementById('root')
);