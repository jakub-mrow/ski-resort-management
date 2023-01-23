import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getReservations, deleteReservation } from '../../api/reservationRequests';
import { getReservationCost } from '../../api/reservationCostRequest';

import { Button, Alert, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';
import { ConfirmDialog } from '../../components';

import { ReservationCostModal } from '../../components';

function Reservations() {
    const [reservations, setReservations] = useState([]);
    const { reservationObject, setReservationObject } = useStateContext();

    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subtitle: "" })
    const [reservationModal, setReservationModal] = useState({ isOpen: false, title: "", subtitle: "" });

    const fetchReservations = async () => {
        const reservations = await getReservations();
        setReservations(reservations);
    }

    useEffect(() => {
        fetchReservations();
    }, [])

    const sendReservationData = (data) => {
        setReservationObject(data);
    }


    let navigate = useNavigate();
    const navigateEditRoute = (id) => {
        let path = `/reservations/${id}/edit`;
        navigate(path);
    }

    const navigateCreateRoute = () => {
        let path = `/reservations/create`;
        navigate(path);
    }


    const handleDeleteReservation = (id) => {
        try {
            setConfirmDialog({
                isOpen: true,
                title: "Are you sure you want to delete this record?",
                subtitle: "",
                onConfirm: () => { deleteReservationAction(id) }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const deleteReservationAction = (id) => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        deleteReservation(id);
        setReservations(reservations.filter((item) => item.id !== id));
        setAlertSeverity("success");
        setShowAlert("Reservation deleted successfully");
    }

    const handleCostModal = async (reservationId) => {
        const data = await getReservationCost(reservationId);

        setReservationModal({
            isOpen: true,
            title: `${data.reservation_cost} PLN`,
            subtitle: `Total cost of the reservation: ${reservationId}`
        })
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
                                sendReservationData(params.row);
                                navigateEditRoute(params.row.id)
                            }}>
                            Edit
                        </Button>
                        <Button variant="contained"
                            style={{
                                backgroundColor: "#e31809",
                            }}
                            onClick={() => handleDeleteReservation(params.row.id)}>Delete
                        </Button>
                        <Button variant="contained" onClick={() => handleCostModal(params.row.id)}>Cost
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
            field: "number_of_people",
            headerName: "Number of people",
            width: 200
        },
        {
            field: "guest",
            headerName: "Guest",
            width: 250
        },
        {
            field: "room",
            headerName: "Room",
            width: 100
        },
        {
            field: "employee",
            headerName: "Employee",
            width: 250
        }
    ]

    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
                <Header category="Page" title="Reservations" />

                <div className="flex flex-wrap lg:flex-nowrap justify-center">
                    <Box sx={{ height: 650, width: '100%' }}>
                        <DataGrid
                            rows={reservations}
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
                    <Button variant="contained" onClick={navigateCreateRoute}>Add new reservation</Button>
                </div>
            </div>
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={showAlert !== null} autoHideDuration={3000} onClose={() => setShowAlert(null)}>
                <Alert severity={alertSeverity}>{showAlert}</Alert>
            </Snackbar>
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />

            <ReservationCostModal 
                reservationModal={reservationModal}
                setReservationModal={setReservationModal}
            />
        </>
    )
}

export default Reservations;