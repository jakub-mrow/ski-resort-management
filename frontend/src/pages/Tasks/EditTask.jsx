import React, { useEffect, useState } from 'react'

import { Header } from '../../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateTask, getTask } from '../../api/taskRequests';
import { useStateContext } from '../../context/ContextProvider';

import { Button, Alert, Snackbar } from '@mui/material';


import TextField from '@mui/material/TextField';

const EditTask = () => {
    const {register, handleSubmit, formState: { errors }} = useForm();
    const { taskObject, setTaskObject } = useStateContext();
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const params = useParams();

    useEffect(() => {
        const fetchTask = async () => {
            const data = await getTask(params.id)
        }
        const fetchOrRedirect = async () => {
            try {
                await fetchTask();
            } catch(error) {
                routeChange();
            }
        }

        fetchOrRedirect();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/tasks'; 
        navigate(path);
    }

    const onSubmit = async (data) => {
        const response = await updateTask(params.id, data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Task edited successfully!");
    }


    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Page" title="Edit task" />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="flex flex-col space-y-4 mx-auto justify-center items-center">

                        <TextField 
                            id="outlined-basic" 
                            label="Name" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("name", {
                                required: "Name is required",
                                pattern: {
                                    value: /^[^0-9]{0,128}$/,
                                    message: "Name cannot consist of numbers and is max 128 characters long"
                                }
                            })}
                            error={!!errors?.name}
                            helperText={errors?.name ? errors.name.message : null} 
                            defaultValue={taskObject.name}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Description" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("description", {
                                required: "Description is required",
                                pattern: {
                                    value: /^.{0,256}$/,
                                    message: "Description must be max 256 characters long"
                                }
                            })}
                            error={!!errors?.description}
                            helperText={errors?.description ? errors.description.message : null} 
                            defaultValue={taskObject.description}
                        />

                        <Button type="submit" variant="contained">Edit task</Button>
                        <Button variant="contained" onClick={routeChange}>Back</Button>
                    </div>
            </form>
        </div>
        <Snackbar open={showAlert !== null} autoHideDuration={3000} onClose={() => setShowAlert(null)}>
            <Alert severity={alertSeverity}>{showAlert}</Alert>
        </Snackbar>
    </>
    );
  };
export default EditTask;