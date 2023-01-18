import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getDuties, deleteDuty } from '../../api/dutyRequests';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';

const Duties = () => {
    const [duties, setDuties] = useState([]);
    const { dutyObject, setDutyObject } = useStateContext();

    const fetchDuties = async () => {
        const duties = await getDuties();
        console.log(duties)
        setDuties(duties);
    }

    useEffect(() => {
        fetchDuties();
    }, [])

    const sendDutyData = (data) => {
        setDutyObject(data);
    }

    let navigate = useNavigate(); 
    const navigateEditRoute = (id) => {
        let path = `/duties/${id}/edit`;
        navigate(path);
    }

    const navigateCreateRoute = () =>{ 
        let path = `/duties/create`; 
        navigate(path);
    }

    const handleDeleteDuty = (id) => {
        try {
            deleteDuty(id);
            setDuties(duties.filter((item) => item.id !== id));
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
                            sendDutyData(params.row);
                            navigateEditRoute(params.row.id)}}>
                            Edit
                        </Button>
                        <Button variant="contained"
                            style={{
                                backgroundColor: "#e31809",
                            }} 
                            onClick={() => handleDeleteDuty(params.row.id)}>Delete
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
            field: "employee",
            headerName: "Employee",
            width: 200
        },
        {
            field: "task",
            headerName: "Task",
            width: 200
        },
        {
            field: "localization",
            headerName: "Localization",
            width: 200
        },
    ]


    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
            <Header category="Page" title="Duties" />

            <div className="flex flex-wrap lg:flex-nowrap justify-center">
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={duties}
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
                <Button variant="contained" onClick={navigateCreateRoute}>Add new duty</Button>
            </div>
        </div>
    )
}

export default Duties;