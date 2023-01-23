import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getRooms, deleteRoom } from '../../api/roomRequests';

import { Button, Alert, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';
import { ConfirmDialog } from '../../components';

const Rooms = () => {

    const [rooms, setRooms] = useState([]);
    const { roomObject, setRoomObject } = useStateContext();

    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subtitle: "" })


    const sendRoomData = (data) => {
        setRoomObject(data)
    }

    const fetchRooms = async () => {
        const rooms = await getRooms();
        setRooms(rooms);
    }

    useEffect(() => {
        fetchRooms();
    }, [])

    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/rooms/create`;
        navigate(path);
    }

    const navigateEditRoute = (id) => {
        let path = `/rooms/${id}/edit`;
        navigate(path)
    }

    const handleDelete = (id) => {
        try {
            setConfirmDialog({
                isOpen: true,
                title: "Are you sure you want to delete this record?",
                subtitle: "It may affect other relations",
                onConfirm: () => { deleteRoomAction(id) }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const deleteRoomAction = (id) => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        deleteRoom(id);
        setRooms(rooms.filter((item) => item.room_id !== id))
        setAlertSeverity("success");
        setShowAlert("Room deleted successfully");
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
                                sendRoomData(params.row);
                                navigateEditRoute(params.row.room_id)
                            }}>Edit</Button>
                        <Button variant="contained"
                            style={{
                                backgroundColor: "#e31809",
                            }}
                            onClick={() => handleDelete(params.row.room_id)}>Delete</Button>
                    </div>
                )
            }
        }
    ]

    const columns = [
        {
            field: "room_id",
            headerName: "Room number",
            width: 150
        },
        {
            field: "wing",
            headerName: "Wing",
            width: 100
        },
        {
            field: "description",
            headerName: "Description",
            width: 700
        },
        {
            field: "beds",
            headerName: "Number of beds",
            width: 150
        },
        {
            field: "price",
            headerName: "Price per night",
            width: 200
        }
    ]

    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
                <Header category="Page" title="Rooms" />

                <div className="flex flex-wrap lg:flex-nowrap justify-center">
                    <Box sx={{ height: 650, width: '100%' }}>
                        <DataGrid
                            rows={rooms}
                            columns={columns.concat(actionColumn)}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            disableSelectionOnClick
                            getRowId={(row) => row.room_id}
                            experimentalFeatures={{ newEditingApi: true }}
                        />
                    </Box>
                </div>

                <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                    <Button variant="contained" onClick={routeChange}>Add new room</Button>
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
export default Rooms;