import React, { useEffect, useState } from 'react'

import { Header } from '../../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateRoom, getRoom } from '../../api/roomRequests';
import { useStateContext } from '../../context/ContextProvider';

import { Button, Alert, Snackbar } from '@mui/material';


import TextField from '@mui/material/TextField';

const EditRoom = () => {
    const {register, handleSubmit, formState: { errors }} = useForm();
    const { roomObject, setRoomObject } = useStateContext();
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const params = useParams();

    useEffect(() => {
        const fetchRoom = async () => {
            const data = await getRoom(params.id)
        }
        const fetchOrRedirect = async () => {
            try {
                await fetchRoom();
            } catch(error) {
                routeChange();
            }
        }

        fetchOrRedirect();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/rooms'; 
        navigate(path);
    }

    const onSubmit = async (data) => {
        const response = await updateRoom(params.id, data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Room edited successfully!");
    }


    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Page" title="Edit room" />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="flex flex-col space-y-4 mx-auto justify-center items-center">

                        <TextField 
                            id="outlined-basic"
                            type="number" 
                            label="Room number" 
                            variant="filled"
                            style={{width: 400}}
                            {...register("room_id", {
                                required: "Room number is required",
                                pattern: {
                                    value: /^\d*[1-9]\d*$/,
                                    message: "Room number must be greater than 0"
                                }
                            })}
                            InputProps={{
                                readOnly: true,
                            }}
                            error={!!errors?.room_id}
                            helperText={errors?.room_id ? errors.room_id.message : null} 
                            defaultValue={roomObject.room_id}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Wing" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("wing", {
                                required: "Wing is required",
                                pattern: {
                                    value: /^[\p{Lu}][\p{L}]{0,128}$/u,
                                    message: "Wing must consist of letters, be capitalized and max 128 characters long"
                                }
                            })}
                            error={!!errors?.wing}
                            helperText={errors?.wing ? errors.wing.message : null} 
                            defaultValue={roomObject.wing}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Description" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("description", {
                                required: "Description is required",
                                pattern: {
                                    value: /^[\p{Lu}][^0-9]{0,256}$/u,
                                    message: "Description cannot consist of numbers, is capitalized and max 256 characters long"
                                }
                            })}
                            error={!!errors?.description}
                            helperText={errors?.description ? errors.description.message : null} 
                            defaultValue={roomObject.description}
                        />

                        <TextField 
                            id="outlined-basic"
                            type="number" 
                            label="Number of beds" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("beds", {
                                required: "Number of beds is required",
                                pattern: {
                                    value: /^\d*[1-9]\d*$/,
                                    message: "Number of beds must be greater than 0"
                                }
                            })}
                            error={!!errors?.beds}
                            helperText={errors?.beds ? errors.beds.message : null} 
                            defaultValue={roomObject.beds}
                        />

                        <TextField 
                            id="outlined-basic"
                            label="Price per night" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("price", {
                                required: "Price is required",
                                pattern: {
                                    value: /^\d+(\.\d{1,2})?$/,
                                    message: "Price must be a positive number with max 2 decimal digits"
                                }
                            })}
                            error={!!errors?.price}
                            helperText={errors?.price ? errors.price.message : null} 
                            defaultValue={roomObject.price}
                        />

                        <Button type="submit" variant="contained">Edit room</Button>
                        <Button variant="contained" onClick={routeChange}>Back</Button>
                    </div>
            </form>
        </div>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} key={'bottom' + 'right'} open={showAlert !== null} autoHideDuration={3000} onClose={() => setShowAlert(null)}>
            <Alert severity={alertSeverity}>{showAlert}</Alert>
        </Snackbar>
    </>
    );
  };
export default EditRoom;