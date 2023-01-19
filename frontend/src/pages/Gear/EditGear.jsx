import React, { useEffect, useState } from 'react'

import { Header } from '../../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateGear, getGear } from '../../api/gearRequests';
import { useStateContext } from '../../context/ContextProvider';

import { Button, Alert, Snackbar } from '@mui/material';


import TextField from '@mui/material/TextField';

const EditGear = () => {
    const {register, handleSubmit, formState: { errors }} = useForm();
    const { gearObject, setGearObject } = useStateContext();
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const params = useParams();

    useEffect(() => {
        const fetchGear = async () => {
            const data = await getGear(params.id)
        }
        const fetchOrRedirect = async () => {
            try {
                await fetchGear();
            } catch(error) {
                routeChange();
            }
        }

        fetchOrRedirect();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/gear'; 
        navigate(path);
    }

    const onSubmit = async (data) => {
        try{
            const response = await updateGear(params.id, data);
            if (response) {
                setAlertSeverity("success");
                setShowAlert("Gear edited successfully!");
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
                <Header category="Page" title="Edit gear" />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="flex flex-col space-y-4 mx-auto justify-center items-center">

                        <TextField 
                            id="outlined-basic" 
                            label="Code" 
                            variant="outlined"
                            {...register("code", {required: "Code is required"})}
                            error={!!errors?.code}
                            helperText={errors?.code ? errors.code.message : null} 
                            defaultValue={gearObject.code}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Type" 
                            variant="outlined"
                            {...register("type", {required: "Type is required"})}
                            error={!!errors?.type}
                            helperText={errors?.type ? errors.type.message : null} 
                            defaultValue={gearObject.type}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Name" 
                            variant="outlined"
                            {...register("name", {required: "Name is required"})}
                            error={!!errors?.name}
                            helperText={errors?.name ? errors.name.message : null} 
                            defaultValue={gearObject.name}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Brand" 
                            variant="outlined"
                            {...register("brand", {required: "Brand is required"})}
                            error={!!errors?.brand}
                            helperText={errors?.brand ? errors.brand.message : null} 
                            defaultValue={gearObject.brand}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Size" 
                            variant="outlined"
                            {...register("size", {required: "Size is required"})}
                            error={!!errors?.size}
                            helperText={errors?.size ? errors.size.message : null} 
                            defaultValue={gearObject.size}
                        />

                        <Button type="submit" variant="contained">Edit gear</Button>
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
export default EditGear;