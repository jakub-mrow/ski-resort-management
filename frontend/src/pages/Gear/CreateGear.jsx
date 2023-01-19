import React, { useState } from 'react'

import { Header } from '../../components';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { postGear } from '../../api/gearRequests';

import { Button, Alert, Snackbar } from '@mui/material';

import TextField from '@mui/material/TextField';

function CreateGear() {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");


    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/gear'; 
        navigate(path);
    }
    
    const {register, handleSubmit, formState: { errors }} = useForm();

    const onSubmit = async (data) => {
        try{
            const response = await postGear(data);
            if (response) {
                setAlertSeverity("success");
                setShowAlert("Gear added successfully!");
                return;
            }
        } catch (error){
            setAlertSeverity("error");
            const errorMsg = JSON.parse(error.message);
            setShowAlert(errorMsg.msg);
        }
    }

    return (
    <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Add gear" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                    <TextField 
                        id="outlined-basic" 
                        label="Code" 
                        variant="outlined"
                        style={{width: 400}}
                        {...register("code", {required: "Code is required"})}
                        error={!!errors?.code}
                        helperText={errors?.code ? errors.code.message : null} 
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Type" 
                        variant="outlined"
                        style={{width: 400}}
                        {...register("type", {required: "Type is required"})}
                        error={!!errors?.type}
                        helperText={errors?.type ? errors.type.message : null} 
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Name" 
                        variant="outlined"
                        style={{width: 400}}
                        {...register("name", {required: "Name is required"})}
                        error={!!errors?.name}
                        helperText={errors?.name ? errors.name.message : null} 
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Brand" 
                        variant="outlined"
                        style={{width: 400}}
                        {...register("brand", {required: "Brand is required"})}
                        error={!!errors?.brand}
                        helperText={errors?.brand ? errors.brand.message : null} 
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Size" 
                        variant="outlined"
                        style={{width: 400}}
                        {...register("size", {required: "Size is required"})}
                        error={!!errors?.size}
                        helperText={errors?.size ? errors.size.message : null} 
                    />

                    <Button type="submit" variant="contained" >Add gear</Button>
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
export default CreateGear