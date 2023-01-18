import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getTasks, deleteTask } from '../../api/taskRequests';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';

const Tasks = () => {

    const [tasks, setTasks] = useState([]);
    const { taskObject, setTaskObject } = useStateContext();

    const sendTaskData = (data) => {
        setTaskObject(data)
    }

    const fetchTasks = async () => {
        const tasks = await getTasks();
        setTasks(tasks);
    }

    useEffect(() => {
        fetchTasks();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/tasks/create`; 
        navigate(path);
    }

    const navigateEditRoute = (id) => {
        let path = `/tasks/${id}/edit`;
        navigate(path)
    }

    const handleDelete = (id) => {
        try {
            deleteTask(id);
            setTasks(tasks.filter((item) => item.id !== id))
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
                            sendTaskData(params.row);
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
            field: "name",
            headerName: "Name",
            width: 200
        },
        {
            field: "description",
            headerName: "Description",
            width: 400
        }
    ]

    return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
        <Header category="Page" title="Tasks" />

        <div className="flex flex-wrap lg:flex-nowrap justify-center">
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={tasks}
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
            <Button variant="contained" onClick={routeChange}>Add new task</Button>
        </div>
    </div>
    )
};
export default Tasks;