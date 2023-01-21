import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getGuests, deleteGuest } from '../../api/guestRequests';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';


const Guests = () => {

    const [guests, setGuests] = useState([]);
    const { guestObject, setGuestObject } = useStateContext();

    const sendGuestData = (data) => {
        setGuestObject(data)
    }

    const fetchGuests = async () => {
        const guests = await getGuests();
        setGuests(guests);
    }

    useEffect(() => {
        fetchGuests();
    }, [])


    // useEffect(() => {
    //     console.log(guests);
    // }, [guests])


    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/guests/create`; 
        navigate(path);
    }

    const navigateEditRoute = (id) => {
        let path = `/guests/${id}/edit`;
        navigate(path)
    }

    const navigateInfoRoute = (id) => {
        let path = `/guests/${id}/info`;
        navigate(path)
    }

    const handleDelete = (id) => {
        try {
            deleteGuest(id);
            setGuests(guests.filter((item) => item.id !== id))
        } catch (error) {
            console.log(error)
        }
    }

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 300,
            renderCell: (params) => {
                return (
                    <div className="p-2 space-x-4">
                        <Button variant="contained"
                            style={{
                                backgroundColor: "#21b6ae",
                            }} 
                            onClick={() => {
                            sendGuestData(params.row);
                            navigateEditRoute(params.row.id)}}>Edit</Button>
                        <Button variant="contained"
                            style={{
                                backgroundColor: "#e31809",
                            }}  
                            onClick={() => handleDelete(params.row.id)}>Delete</Button>

                        <Button variant="contained" 
                            onClick={() => navigateInfoRoute(params.row.id)}>Info</Button>
                    </div>
                )
            }
        }
    ]

    const columns = [
        {
            field: "social_security_number",
            headerName: "Social security number",
            width: 200
        },
        {
            field: "name",
            headerName: "Name",
            width: 100
        },
        {
            field: "surname",
            headerName: "Surname",
            width: 200
        },
        {
            field: "email",
            headerName: "Email",
            width: 300
        },
        {
            field: "address",
            headerName: "Address",
            width: 400
        }
    ]

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
            <Header category="Page" title="Guests" />

            <div className="flex flex-wrap lg:flex-nowrap justify-center">
                <Box sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={guests}
                        columns={columns.concat(actionColumn)}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </Box>
            </div>
        
            <div className="flex flex-col space-y-4 mx-auto justify-center items-center">
                <Button variant="contained" onClick={routeChange}>Add new guest</Button>
            </div>
        </div>
    )
};
export default Guests;
