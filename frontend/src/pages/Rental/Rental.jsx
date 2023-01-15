import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getRentals, deleteRental } from '../../api/rentalRequests';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';

const Rental = () => {
    const [rentals, setRentals] = useState([]);
    const { rentalObject, setRentalObject } = useStateContext();

    const fetchRentals = async () => {
        const rentals = await getRentals();
        console.log(rentals)
        setRentals(rentals);
    }

    useEffect(() => {
        fetchRentals();
    }, [])

    const sendRentalData = (data) => {
        setRentalObject(data);
    }

    let navigate = useNavigate(); 
    const navigateEditRoute = (id) => {
        let path = `/rentals/${id}/edit`;
        navigate(path);
    }

    const navigateCreateRoute = () =>{ 
        let path = `/rentals/create`; 
        navigate(path);
    }

    const handleDeleteRental = (id) => {
        try {
            deleteRental(id);
            setRentals(rentals.filter((item) => item.id !== id));
        } catch (error) {
            console.log(error);
        }
    }

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="p-2 space-x-4">
                        <Button variant="contained"
                            style={{
                                backgroundColor: "#21b6ae",
                            }} 
                            onClick={() => {
                            sendRentalData(params.row);
                            navigateEditRoute(params.row.id)}}>
                            Edit
                        </Button>
                        <Button variant="contained"
                            style={{
                                backgroundColor: "#e31809",
                            }} 
                            onClick={() => handleDeleteRental(params.row.id)}>Delete
                        </Button>
                    </div>
                )
            }
        }
    ]
    const columns = [
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


    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
            <Header category="Page" title="Rentals" />

            <div className="flex flex-wrap lg:flex-nowrap justify-center">
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rentals}
                        columns={columns.concat(actionColumn)}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                    />
                </Box>
            </div>
        
            <div className="flex flex-col space-y-4 mx-auto justify-center items-center">
                <Button variant="contained" onClick={navigateCreateRoute}>Add new rental</Button>
            </div>
        </div>
    )
}

export default Rental;