import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getRooms, deleteRoom } from '../../api/roomRequests';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';

const Rooms = () => {

    const [rooms, setRooms] = useState([]);
    const { roomObject, setRoomObject } = useStateContext();

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
    const routeChange = () =>{ 
        let path = `/rooms/create`; 
        navigate(path);
    }

    const navigateEditRoute = (id) => {
        let path = `/rooms/${id}/edit`;
        navigate(path)
    }

    const handleDelete = (id) => {
        try {
            deleteRoom(id);
            setRooms(rooms.filter((item) => item.id !== id))
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
                            sendRoomData(params.row);
                            navigateEditRoute(params.row.id)}}>Edit</Button>
                        <Button variant="contained" onClick={() => handleDelete(params.row.id)}>Delete</Button>
                    </div>
                )
            }
        }
    ]

    const columns = [
        {
            field: "room_id",
            headerName: "Room number",
            width: 200
        },
        {
            field: "wing",
            headerName: "Wing",
            width: 200
        },
        {
            field: "description",
            headerName: "Description",
            width: 300
        },
        {
            field: "beds",
            headerName: "Number of beds",
            width: 200
        },
        {
            field: "price",
            headerName: "Price per night",
            width: 200
        }
    ]

    return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
        <Header category="Page" title="Rooms" />

        <div className="flex flex-wrap lg:flex-nowrap justify-center">
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rooms}
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
            <Button variant="contained" onClick={routeChange}>Add new room</Button>
        </div>
    </div>
    )
};
export default Rooms;