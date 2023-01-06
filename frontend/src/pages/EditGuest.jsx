import React, { useEffect, useState } from 'react'

import { Header } from '../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateGuest, getGuest } from '../api/guestRequests';
import { useStateContext } from '../context/ContextProvider';

import { Button, Alert, Snackbar } from '@mui/material';


import TextField from '@mui/material/TextField';

const EditGuest = () => {
    const {register, handleSubmit, formState: { errors }} = useForm();
    const { guestObject, setGuestObject } = useStateContext();
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const params = useParams();

    useEffect(() => {
        const fetchGuest = async () => {
            const data = await getGuest(params.id)
        }
        const fetchOrRedirect = async () => {
            try {
                await fetchGuest();
            } catch(error) {
                routeChange();
            }
        }

        fetchOrRedirect();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/guests`; 
        navigate(path);
    }

    const onSubmit = async (data) => {
        const response = await updateGuest(params.id, data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Guest edited successfully!");
    }


    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Page" title="Edit guest" />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                        <TextField 
                            id="outlined-basic"
                            type="number" 
                            label="Social security number" 
                            variant="outlined"
                            {...register("social_security_number", {
                                required: "Social security number is required",
                                pattern: {
                                    value: /\d{11}/,
                                    message: "Number must consist of 11 digits"
                                }
                            })}
                            error={!!errors?.social_security_number}
                            helperText={errors?.social_security_number ? errors.social_security_number.message : null}
                            defaultValue={guestObject.social_security_number}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Name" 
                            variant="outlined"
                            {...register("name", {required: "Name is required"})}
                            error={!!errors?.name}
                            helperText={errors?.name ? errors.name.message : null}
                            defaultValue={guestObject.name} 
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Surname" 
                            variant="outlined"
                            {...register("surname", {required: "Surname is required"})}
                            error={!!errors?.surname}
                            helperText={errors?.surname ? errors.surname.message : null}
                            defaultValue={guestObject.surname}   
                        />
                        <TextField 
                            id="outlined-basic" 
                            label="Email address" 
                            variant="outlined" 
                            {...register("email", {required: "Email is required"})}
                            error={!!errors?.email}
                            helperText={errors?.email ? errors.email.message : null}
                            defaultValue={guestObject.email}   
                            
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Address" 
                            variant="outlined" 
                            {...register("address", {required: "Address is required"})}
                            error={!!errors?.address}
                            helperText={errors?.address ? errors.address.message : null}
                            defaultValue={guestObject.address}   
                            
                        />

                        <Button type="submit" variant="contained">Edit guest</Button>
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
export default EditGuest;