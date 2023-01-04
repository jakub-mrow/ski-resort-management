import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Navbar, Sidebar } from './components';

import { Dashboard, Information, Employees, CreateEmployee, EditEmployee, Guests, CreateGuest, EditGuest, Dishes, CreateDish, EditDish, Desserts, CreateDessert, EditDessert, Gear, CreateGear, EditGear, Localizations, CreateLocalization, EditLocalization } from './pages';

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
                                <Route path="/employees/create" element={<CreateEmployee/>}></Route>
                                <Route path="/employees/:id/edit" element={<EditEmployee/>}></Route>
                                <Route path="/guests" element={<Guests/>}></Route>
                                <Route path="/guests/create" element={<CreateGuest/>}></Route>
                                <Route path="/guests/:id/edit" element={<EditGuest/>}></Route>
                                <Route path="/dishes" element={<Dishes/>}></Route>
                                <Route path="/dishes/create" element={<CreateDish/>}></Route>
                                <Route path="/dishes/:id/edit" element={<EditDish/>}></Route>
                                <Route path="/desserts" element={<Desserts/>}></Route>
                                <Route path="/desserts/create" element={<CreateDessert/>}></Route>
                                <Route path="/desserts/:id/edit" element={<EditDessert/>}></Route>
                                <Route path="/gear" element={<Gear/>}></Route>
                                <Route path="/gear/create" element={<CreateGear/>}></Route>
                                <Route path="/gear/:id/edit" element={<EditGear/>}></Route>
                                <Route path="/localizations" element={<Localizations/>}></Route>
                                <Route path="/localizations/create" element={<CreateLocalization/>}></Route>
                                <Route path="/localizations/:id/edit" element={<EditLocalization/>}></Route>
                            </Routes>
                        </div>

                    </div>

                </div>            
            </BrowserRouter>
        </div>
    )
}


export default App