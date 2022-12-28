import React, { createContext, useContext, userContext, useState} from 'react';
import { act } from 'react-dom/test-utils';


const StateContext = createContext();

const initialState = {
    userProfile: false
}

export const ContextProvider = ({ children }) => {
    
    const [activeMenu, setActiveMenu] = useState(true);
    const [isClicked, setIsClicked] = useState(initialState);
    const [screenSize, setScreenSize] = useState(undefined);
    const [authenticated, setauthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated") || false));

    const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true});
    
    return (
        <StateContext.Provider value = {{activeMenu: activeMenu, 
                                         setActiveMenu: setActiveMenu,
                                         isClicked, 
                                         setIsClicked,
                                         handleClick,
                                         screenSize,
                                         setScreenSize,
                                         initialState}}>
            {children}
        </StateContext.Provider>
    )
}


export const useStateContext = () => useContext(StateContext);