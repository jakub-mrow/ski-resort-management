import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../components';

import { getDishes, deleteDish } from '../api/dishRequests';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../context/ContextProvider';

const Dishes = () => {

    const [dishes, setDishes] = useState([]);
    const { dishObject, setDishObject } = useStateContext();

    const sendDishData = (data) => {
        setDishObject(data)
    }

    const fetchDishes = async () => {
        const dishes = await getDishes();
        setDishes(dishes);
    }

    useEffect(() => {
        fetchDishes();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/dishes/create`; 
        navigate(path);
    }

    const navigateEditRoute = (id) => {
        let path = `/dishes/${id}/edit`;
        navigate(path)
    }

    const handleDelete = (id) => {
        try {
            deleteDish(id);
            setDishes(dishes.filter((item) => item.id !== id))
        } catch (error) {
            console.log(error)
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
                        <Button variant="contained" onClick={() => {
                            sendDishData(params.row);
                            navigateEditRoute(params.row.id)}}>Edit</Button>
                        <Button variant="contained" onClick={() => handleDelete(params.row.id)}>Delete</Button>
                    </div>
                )
            }
        }
    ]

    const columns = [
        {
            field: "name",
            headerName: "Name",
            width: 200
        },
        {
            field: "description",
            headerName: "Description",
            width: 300
        },
        {
            field: "calories",
            headerName: "Calories",
            width: 200
        },
        {
            field: "cost",
            headerName: "Preparation cost",
            width: 200
        },
        {
            field: "price",
            headerName: "Menu price",
            width: 200
        }
    ]

    return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
        <Header category="Page" title="Dishes" />

        <div className="flex flex-wrap lg:flex-nowrap justify-center">
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={dishes}
                    columns={columns.concat(actionColumn)}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                />
            </Box>
        </div>

        <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
            <Button variant="contained" onClick={routeChange}>Add new dish</Button>
        </div>
    </div>
    )
};
export default Dishes;