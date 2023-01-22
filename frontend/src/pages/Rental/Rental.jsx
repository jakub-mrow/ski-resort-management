import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getRentals, deleteRental } from '../../api/rentalRequests';

import { Button, Alert, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';
import { ConfirmDialog } from '../../components';

const Rental = () => {
    const [rentals, setRentals] = useState([]);
    const { rentalObject, setRentalObject } = useStateContext();

    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subtitle: "" })


    const fetchRentals = async () => {
        const rentals = await getRentals();
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

    const navigateCreateRoute = () => {
        let path = `/rentals/create`;
        navigate(path);
    }

    const handleDeleteRental = (id) => {
        try {
            setConfirmDialog({
                isOpen: true,
                title: "Are you sure you want to delete this record?",
                subtitle: "",
                onConfirm: () => { deleteRentalAction(id) }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const deleteRentalAction = (id) => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        deleteRental(id);
        setRentals(rentals.filter((item) => item.id !== id));
        setAlertSeverity("success");
        setShowAlert("Rental deleted successfully");
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
                                navigateEditRoute(params.row.id)
                            }}>
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
            width: 150
        },
        {
            field: "date_to",
            headerName: "Date to",
            width: 150
        },
        {
            field: "price",
            headerName: "Price",
            width: 100
        },
        {
            field: "gear",
            headerName: "Gear",
            width: 300
        },
        {
            field: "guest",
            headerName: "Guest",
            width: 200
        },
        {
            field: "employee",
            headerName: "Employee",
            width: 200
        },
    ]


    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
                <Header category="Page" title="Rentals" />

                <div className="flex flex-wrap lg:flex-nowrap justify-center">
                    <Box sx={{ height: 650, width: '100%' }}>
                        <DataGrid
                            rows={rentals}
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
                    <Button variant="contained" onClick={navigateCreateRoute}>Add new rental</Button>
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

export default Rental;