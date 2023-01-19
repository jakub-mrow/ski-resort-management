import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import { Header } from '../../components';

import { getGuestInfo } from '../../api/guestRequests';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';

function GuestInfo() {

    const [guestInfo, setGuestInfo] = useState({});
    const [guestInfoReservations, setGuestInfoReservations] = useState([]);
    const [guestInfoMeals, setGuestInfoMeals] = useState([]);
    const [guestInfoRentals, setGuestInfoRentals] = useState([]);

    const { guestObject, setGuestObject } = useStateContext();

    const params = useParams();

    useEffect(() => {
        const fetchGuestInfo = async () => {
            const guests = await getGuestInfo(params.id);
            setGuestInfo(guests);
            setGuestInfoMeals(guests.meals);
            setGuestInfoRentals(guests.rentals);
            setGuestInfoReservations(guests.reservations);
        }
        fetchGuestInfo();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/guests`; 
        navigate(path);
    }

    const reservationColumns = [
        {
            field: "id",
            headerName: "Id",
            width: 100
        },
        {
            field: "date_from",
            headerName: "Date from",
            width: 200
        },
        {
            field: "date_to",
            headerName: "Date to",
            width: 200
        },
        {
            field: "number_of_people",
            headerName: "Number of people",
            width: 150
        },
        {
            field: "guest",
            headerName: "Guest",
            width: 220
        },
        {
            field: "room",
            headerName: "Room",
            width: 200
        },
        {
            field: "employee",
            headerName: "Employee",
            width: 220
        }
    ]

    const rentalColumns = [
        {
            field: "id",
            headerName: "Id",
            width: 100
        },
        {
            field: "date_from",
            headerName: "Date from",
            width: 200
        },
        {
            field: "date_to",
            headerName: "Date to",
            width: 200
        },
        {
            field: "price",
            headerName: "Price",
            width: 150
        },
        {
            field: "gear",
            headerName: "Gear",
            width: 220
        },
        {
            field: "guest",
            headerName: "Guest",
            width: 220
        },
        {
            field: "employee",
            headerName: "Employee",
            width: 200
        },
    ]


    const mealColumns = [
        {
            field: "id",
            headerName: "Id",
            width: 100
        },
        {
            field: "guest",
            headerName: "Guest",
            width: 200
        },
        {
            field: "date",
            headerName: "Date",
            width: 100
        },
        {
            field: "time_of_day",
            headerName: "Time of day",
            width: 200
        },
        {
            field: "dish",
            headerName: "Dish",
            width: 200
        },
        {
            field: "dessert",
            headerName: "Dessert",
            width: 200
        },
    ]


    return (
        <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
            <Header category="Page" title="Guest Information" />

            <div className="flex flex-col space-y-4 mx-auto justify-center items-center">
                <Button variant="contained" onClick={routeChange}>Back</Button>
            </div>
        </div>

        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                Reservations
            </p>

            <div className="flex flex-wrap lg:flex-nowrap justify-center">
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={guestInfoReservations}
                        columns={reservationColumns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </Box>
            </div>
        </div>

        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                Rentals
            </p>

            <div className="flex flex-wrap lg:flex-nowrap justify-center">
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={guestInfoRentals}
                        columns={rentalColumns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </Box>
            </div>
        </div>

        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                Meals
            </p>

            <div className="flex flex-wrap lg:flex-nowrap justify-center">
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={guestInfoMeals}
                        columns={mealColumns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </Box>
            </div>
        </div>   

    </>
    )
};

export default GuestInfo