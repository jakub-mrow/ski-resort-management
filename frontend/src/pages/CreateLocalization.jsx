import React, { useState } from 'react'

import { Header } from '../components';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { postLocalization } from '../api/localizationRequests';

import { Button, Alert, Snackbar } from '@mui/material';

import TextField from '@mui/material/TextField';

function CreateLocalization() {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");


    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/localizations'; 
        navigate(path);
    }
    
    const {register, handleSubmit, formState: { errors }} = useForm();

    const onSubmit = async (data) => {
        const response = await postLocalization(data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Localization added successfully!");
    }

    return (
    <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Add localization" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                    <TextField 
                        id="outlined-basic" 
                        label="Name" 
                        variant="outlined"
                        {...register("name", {required: "Name is required"})}
                        error={!!errors?.name}
                        helperText={errors?.name ? errors.name.message : null} 
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Address" 
                        variant="outlined"
                        {...register("address", {required: "Address is required"})}
                        error={!!errors?.address}
                        helperText={errors?.address ? errors.address.message : null} 
                    />

                    <Button type="submit" variant="contained" >Add localization</Button>
                    <Button variant="contained" onClick={routeChange}>Back</Button>
                </div>
            </form>
        </div>
        <Snackbar open={showAlert !== null} autoHideDuration={3000} onClose={() => setShowAlert(null)}>
            <Alert severity={alertSeverity}>{showAlert}</Alert>
        </Snackbar>
    </>
    )
}
export default CreateLocalization