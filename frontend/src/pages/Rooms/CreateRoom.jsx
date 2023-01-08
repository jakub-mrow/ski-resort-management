import React, { useState } from 'react'

import { Header } from '../../components';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { postRoom } from '../../api/roomRequests';

import { Button, Alert, Snackbar } from '@mui/material';

import TextField from '@mui/material/TextField';

function CreateRoom() {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");


    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/rooms'; 
        navigate(path);
    }
    
    const {register, handleSubmit, formState: { errors }} = useForm();

    const onSubmit = async (data) => {
        try{
            const response = await postRoom(data);
            if (response) {
                setAlertSeverity("success");
                setShowAlert("Room added successfully!");
                return;
            }
        } catch (error){
            setShowAlert(new String(error));
        }
    }

    return (
    <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Add room" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="flex flex-col space-y-4 mx-auto justify-center items-center">

                    <TextField 
                        id="outlined-basic"
                        type="number" 
                        label="Room number" 
                        variant="outlined"
                        {...register("room_id", {
                            required: "Room number is required",
                            pattern: {
                                value: /^\d*[1-9]\d*$/,
                                message: "Room number must be greater than 0"
                            }
                        })}
                        error={!!errors?.room_id}
                        helperText={errors?.room_id ? errors.room_id.message : null} 
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Wing" 
                        variant="outlined"
                        {...register("wing", {required: "Wing is required"})}
                        error={!!errors?.wing}
                        helperText={errors?.wing ? errors.wing.message : null} 
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Description" 
                        variant="outlined"
                        {...register("description", {required: "Description is required"})}
                        error={!!errors?.description}
                        helperText={errors?.description ? errors.description.message : null} 
                    />

                    <TextField 
                        id="outlined-basic"
                        type="number" 
                        label="Number of beds" 
                        variant="outlined"
                        {...register("beds", {
                            required: "Number of beds is required",
                            pattern: {
                                value: /^\d*[1-9]\d*$/,
                                message: "Number of beds must be greater than 0"
                            }
                        })}
                        error={!!errors?.beds}
                        helperText={errors?.beds ? errors.beds.message : null} 
                    />

                    <TextField 
                        id="outlined-basic"
                        label="Price per night" 
                        variant="outlined"
                        {...register("price", {
                            required: "Price is required",
                            pattern: {
                                value: /^\d+(\.\d{1,2})?$/,
                                message: "Price must have max 2 decimal digits"
                            }
                        })}
                        error={!!errors?.price}
                        helperText={errors?.price ? errors.price.message : null}
                    />

                    <Button type="submit" variant="contained" >Add room</Button>
                    <Button variant="contained" onClick={routeChange}>Back</Button>
                </div>
            </form>
        </div>
        <Snackbar open={showAlert !== null} autoHideDuration={6000} onClose={() => setShowAlert(null)}>
            <Alert severity={alertSeverity}>{showAlert}</Alert>
        </Snackbar>
    </>
    )
}
export default CreateRoom