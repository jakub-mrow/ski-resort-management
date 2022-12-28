import React from 'react'
import { Header } from '../components';
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';

export default function Guests() {


    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/guests/create`; 
        navigate(path);
    }

    return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Page" title="Guests" />

        <div className="flex flex-wrap lg:flex-nowrap justify-center">
            
        </div>

        
        {/* <div class="flex flex-col items-center p-2 justify-center space-y-4 px-6 py-8 mx-auto md:h-screen lg:py-0">
            <Button variant="contained" className="bg-white">Contained</Button>
            <Button variant="contained">Contained</Button>
        </div> */}
        

        <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
            <Button variant="contained" onClick={routeChange}>Add new guest</Button>
        </div>
    </div>
    )
}
