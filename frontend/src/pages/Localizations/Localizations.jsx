import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getLocalizations, deleteLocalization } from '../../api/localizationRequests';

import { Button, Alert, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';
import { ConfirmDialog } from '../../components';

const Localizations = () => {

    const [localizations, setLocalizations] = useState([]);
    const { localizationObject, setLocalizationObject } = useStateContext();

    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subtitle: "" })


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
    const routeChange = () => {
        let path = `/localizations/create`;
        navigate(path);
    }

    const navigateEditRoute = (id) => {
        let path = `/localizations/${id}/edit`;
        navigate(path)
    }

    const handleDelete = (id) => {
        try {
            setConfirmDialog({
                isOpen: true,
                title: "Are you sure you want to delete this record?",
                subtitle: "It may affect other relations",
                onConfirm: () => { deleteLocalizationAction(id) }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const deleteLocalizationAction = (id) => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        deleteLocalization(id);
        setLocalizations(localizations.filter((item) => item.id !== id))
        setAlertSeverity("success");
        setShowAlert("Localization deleted successfully");
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
                                sendLocalizationData(params.row);
                                navigateEditRoute(params.row.id)
                            }}>Edit</Button>
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
            field: "name",
            headerName: "Name",
            width: 600
        },
        {
            field: "address",
            headerName: "Address",
            width: 600
        }
    ]

    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
                <Header category="Page" title="Localizations" />

                <div className="flex flex-wrap lg:flex-nowrap justify-center">
                    <Box sx={{ height: 650, width: '100%' }}>
                        <DataGrid
                            rows={localizations}
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
                    <Button variant="contained" onClick={routeChange}>Add new localization</Button>
                </div>
            </div>
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={showAlert !== null} autoHideDuration={3000} onClose={() => setShowAlert(null)}>
                <Alert severity={alertSeverity}>{showAlert}</Alert>
            </Snackbar>
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    )
};
export default Localizations;