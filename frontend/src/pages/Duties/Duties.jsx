import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getDuties, deleteDuty } from '../../api/dutyRequests';

import { Button, Alert, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';
import { ConfirmDialog } from '../../components';

const Duties = () => {
    const [duties, setDuties] = useState([]);
    const { dutyObject, setDutyObject } = useStateContext();

    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subtitle: "" })


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

    const navigateCreateRoute = () => {
        let path = `/duties/create`;
        navigate(path);
    }

    const handleDeleteDuty = (id) => {
        try {
            setConfirmDialog({
                isOpen: true,
                title: "Are you sure you want to delete this record?",
                subtitle: "",
                onConfirm: () => { deleteDutyAction(id) }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const deleteDutyAction = (id) => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        deleteDuty(id);
        setDuties(duties.filter((item) => item.id !== id));
        setAlertSeverity("success");
        setShowAlert("Duty deleted successfully");
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
                                navigateEditRoute(params.row.id)
                            }}>
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
            width: 300
        },
        {
            field: "task",
            headerName: "Task",
            width: 400
        },
        {
            field: "localization",
            headerName: "Localization",
            width: 400
        },
    ]


    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
                <Header category="Page" title="Duties" />

                <div className="flex flex-wrap lg:flex-nowrap justify-center">
                    <Box sx={{ height: 650, width: '100%' }}>
                        <DataGrid
                            rows={duties}
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
                    <Button variant="contained" onClick={navigateCreateRoute}>Add new duty</Button>
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
}

export default Duties;