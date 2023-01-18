import React, { useState } from 'react'

import { Header } from '../../components';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { postGuest } from '../../api/guestRequests';

import { Button, Alert, Snackbar } from '@mui/material';

import TextField from '@mui/material/TextField';

function CreateGuest() {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/guests`; 
        navigate(path);
    }
    
    const {register, handleSubmit, formState: { errors }} = useForm();

    const onSubmit = async (data) => {
        try{
            const response = await postGuest(data);
            if (response) {
                setAlertSeverity("success");
                setShowAlert("Guest added successfully!");
                return;
            }
        } catch (error){
            setAlertSeverity("error");
            const errorMsg = JSON.parse(error.message);
            if ("msg" in errorMsg){
                setShowAlert(errorMsg.msg);
            }
        }
    }

    return (
        <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Add guest" />

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
                                value: /^\d{11}$/,
                                message: "Number must consist of 11 digits and be positive"
                            }
                        })}
                        error={!!errors?.social_security_number}
                        helperText={errors?.social_security_number ? errors.social_security_number.message : null}
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Name" 
                        variant="outlined"
                        {...register("name", {
                            required: "Name is required",
                            pattern: {
                                value: /^[\s\p{L}]+$/u,
                                message: "Invalid name"
                            }
                        })}
                        error={!!errors?.name}
                        helperText={errors?.name ? errors.name.message : null} 
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Surname" 
                        variant="outlined"
                        {...register("surname", {
                            required: "Surname is required",
                            pattern: {
                                value: /^[\s\p{L}]+$/u,
                                message: "Invalid surname"
                            }
                        })}
                        error={!!errors?.surname}
                        helperText={errors?.surname ? errors.surname.message : null}   
                    />
                    <TextField 
                        id="outlined-basic" 
                        label="Email address"
                        variant="outlined"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        })} 
                        error={!!errors?.email}
                        helperText={errors?.email ? errors.email.message : null}   
                        
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Address" 
                        variant="outlined" 
                        {...register("address", {required: "Address is required"})}
                        error={!!errors?.address}
                        helperText={errors?.address ? errors.address.message : null}   
                        
                    />

                    <Button type="submit" variant="contained" >Add guest</Button>
                    <Button variant="contained" onClick={routeChange}>Back</Button>
                </div>
            </form>
        </div>
        <Snackbar open={showAlert !== null} autoHideDuration={5000} onClose={() => setShowAlert(null)}>
            <Alert severity={alertSeverity}>{showAlert}</Alert>
        </Snackbar>
    </>
    )
}

export default CreateGuest;
