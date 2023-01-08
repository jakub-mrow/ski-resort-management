import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getLocalizations, deleteLocalization } from '../../api/localizationRequests';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';

const Localizations = () => {

    const [localizations, setLocalizations] = useState([]);
    const { localizationObject, setLocalizationObject } = useStateContext();

    const sendLocalizationData = (data) => {
        setLocalizationObject(data)
    }

    const fetchLocalizations = async () => {
        const localizations = await getLocalizations();
        setLocalizations(localizations);
    }

    useEffect(() => {
        fetchLocalizations();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/localizations/create`; 
        navigate(path);
    }

    const navigateEditRoute = (id) => {
        let path = `/localizations/${id}/edit`;
        navigate(path)
    }

    const handleDelete = (id) => {
        try {
            deleteLocalization(id);
            setLocalizations(localizations.filter((item) => item.id !== id))
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
                            sendLocalizationData(params.row);
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
            width: 300
        },
        {
            field: "address",
            headerName: "Address",
            width: 300
        }
    ]

    return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
        <Header category="Page" title="Localizations" />

        <div className="flex flex-wrap lg:flex-nowrap justify-center">
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={localizations}
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
            <Button variant="contained" onClick={routeChange}>Add new localization</Button>
        </div>
    </div>
    )
};
export default Localizations;