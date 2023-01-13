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
    const [guestObject, setGuestObject] = useState({});
    const [employeeObject, setEmployeeObject] = useState({});
    const [dishObject, setDishObject] = useState({});
    const [dessertObject, setDessertObject] = useState({});
    const [gearObject, setGearObject] = useState({});
    const [localizationObject, setLocalizationObject] = useState({});
    const [taskObject, setTaskObject] = useState({});
    const [roomObject, setRoomObject] = useState({});
    const [reservationObject, setReservationObject] = useState({});
    const [rentalObject, setRentalObject] = useState({});
    const [mealObject, setMealObject] = useState({});
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
                                         initialState,
                                         guestObject,
                                         setGuestObject,
                                         employeeObject,
                                         setEmployeeObject,
                                         dishObject,
                                         setDishObject,
                                         dessertObject,
                                         setDessertObject,
                                         gearObject,
                                         setGearObject,
                                         localizationObject,
                                         setLocalizationObject,
                                         taskObject,
                                         setTaskObject,
                                         roomObject,
                                         setRoomObject,
                                         reservationObject,
                                         setReservationObject,
                                         rentalObject,
                                         setRentalObject,
                                         mealObject,
                                         setMealObject}}>
            {children}
        </StateContext.Provider>
    )
}


export const useStateContext = () => useContext(StateContext);