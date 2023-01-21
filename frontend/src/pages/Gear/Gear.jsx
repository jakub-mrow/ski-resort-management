import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getGearList, deleteGear } from '../../api/gearRequests';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';

const Gear = () => {

    const [gear, setGear] = useState([]);
    const { gearObject, setGearObject } = useStateContext();

    const sendGearData = (data) => {
        setGearObject(data)
    }

    const fetchGear = async () => {
        const gear = await getGearList();
        setGear(gear);
    }

    useEffect(() => {
        fetchGear();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/gear/create`; 
        navigate(path);
    }

    const navigateEditRoute = (id) => {
        let path = `/gear/${id}/edit`;
        navigate(path)
    }

    const handleDelete = (id) => {
        try {
            deleteGear(id);
            setGear(gear.filter((item) => item.id !== id))
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
                        <Button variant="contained" 
                            style={{
                                backgroundColor: "#21b6ae",
                            }}
                            onClick={() => {
                            sendGearData(params.row);
                            navigateEditRoute(params.row.id)}}>Edit</Button>
                        <Button variant="contained"
                            style={{
                                backgroundColor: "#e31809",
                            }}  
                            onClick={() => handleDelete(params.row.id)}>Delete</Button>
                    </div>
                )
            }
        }
    ]

    const columns = [
        {
            field: "code",
            headerName: "Code",
            width: 200
        },
        {
            field: "type",
            headerName: "Type",
            width: 200
        },
        {
            field: "name",
            headerName: "Name",
            width: 400
        },
        {
            field: "brand",
            headerName: "Brand",
            width: 200
        },
        {
            field: "size",
            headerName: "Size",
            width: 200
        }
    ]

    return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
        <Header category="Page" title="Gear" />

        <div className="flex flex-wrap lg:flex-nowrap justify-center">
            <Box sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={gear}
                    columns={columns.concat(actionColumn)}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                />
            </Box>
        </div>

        <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
            <Button variant="contained" onClick={routeChange}>Add new gear</Button>
        </div>
    </div>
    )
};
export default Gear;