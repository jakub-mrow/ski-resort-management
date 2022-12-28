import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Navbar, Sidebar } from './components';
import { Dashboard, Information, Employees, Guests, CreateGuest } from './pages';

import { useStateContext } from './context/ContextProvider';
import './App.css'

const App = () => {
    const { activeMenu } = useStateContext();

    return (
        <div>
            <BrowserRouter>
                <div className="flex relative dark:bg-main-dark-bg">
                    {activeMenu ? (
                        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white transition-all duration-300">
                            <Sidebar/>
                        </div>
                    ) : (
                        <div className="w-0 dark:bg-secondary-dark-bg transition-all duration-300">
                            <Sidebar/>
                        </div>
                    )}

                    <div className={ activeMenu
                                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '}>
                        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                            <Navbar/>
                        </div>

                        <div>
                            <Routes>
                                <Route path="/" element={<Dashboard/>}/>
                                <Route path="/information" element={<Information/>}></Route>
                                <Route path="/employees" element={<Employees/>}></Route>
                                <Route path="/guests" element={<Guests/>}></Route>
                                <Route path="/guests/create" element={<CreateGuest/>}></Route>
                            </Routes>
                        </div>

                    </div>

                </div>            
            </BrowserRouter>
        </div>
    )
}


export default App