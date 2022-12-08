import React from 'react';
import ReactDOM  from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css'
import App from './App';
import { ContextProvider } from './context/ContextProvider';
import { Login } from './pages/';

function CheckLogin(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return <ContextProvider><App/></ContextProvider>;
    }
    return <Login/>;
}


ReactDOM.render(
    <CheckLogin isLoggedIn={true}/>,
    document.getElementById('root')
);