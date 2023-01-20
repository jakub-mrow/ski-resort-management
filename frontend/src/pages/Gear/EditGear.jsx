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
        const response = await updateGear(params.id, data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Gear edited successfully!");
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
                            style={{width: 400}}
                            {...register("code", {
                                required: "Code is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9]{0,128}$/,
                                    message: "Code must consist of letters or numbers and be max 128 characters long"
                                }
                            })}
                            error={!!errors?.code}
                            helperText={errors?.code ? errors.code.message : null} 
                            defaultValue={gearObject.code}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Type" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("type", {
                                required: "Type is required",
                                pattern: {
                                    value: /^[^0-9]{0,256}$/,
                                    message: "Type cannot consist of numbers and is max 256 characters long"
                                }
                            })}
                            error={!!errors?.type}
                            helperText={errors?.type ? errors.type.message : null} 
                            defaultValue={gearObject.type}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Name" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("name", {
                                required: "Name is required",
                                pattern: {
                                    value: /^.{0,128}$/,
                                    message: "Name must be max 128 characters long"
                                }
                            })}
                            error={!!errors?.name}
                            helperText={errors?.name ? errors.name.message : null} 
                            defaultValue={gearObject.name}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Brand" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("brand", {
                                required: "Brand is required",
                                pattern: {
                                    value: /^.{0,128}$/,
                                    message: "Brand must be max 128 characters long"
                                }
                            })}
                            error={!!errors?.brand}
                            helperText={errors?.brand ? errors.brand.message : null} 
                            defaultValue={gearObject.brand}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Size" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("size", {
                                required: "Size is required",
                                pattern: {
                                    value: /^.{0,128}$/,
                                    message: "Size must be max 128 characters long"
                                }
                            })}
                            error={!!errors?.size}
                            helperText={errors?.size ? errors.size.message : null} 
                            defaultValue={gearObject.size}
                        />

                        <Button type="submit" variant="contained">Edit gear</Button>
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
export default EditGear;