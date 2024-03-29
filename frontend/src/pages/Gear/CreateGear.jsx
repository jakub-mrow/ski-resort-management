import React, { useState, useRef } from 'react'

import { Header } from '../../components';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { postGear } from '../../api/gearRequests';

import { Button, Alert, Snackbar } from '@mui/material';

import TextField from '@mui/material/TextField';

function CreateGear() {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const codeRef = useRef(null);
    const typeRef = useRef(null);
    const nameRef = useRef(null);
    const brandRef = useRef(null);
    const sizeRef = useRef(null);


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
                codeRef.current.value = "";
                typeRef.current.value = "";
                nameRef.current.value = "";
                brandRef.current.value = "";
                sizeRef.current.value = "";
                setTimeout(() => {
                    routeChange();
                }, 1000);
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
                        inputRef={codeRef}
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
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Type" 
                        inputRef={typeRef}
                        variant="outlined"
                        style={{width: 400}}
                        {...register("type", {
                            required: "Type is required",
                            pattern: {
                                value: /^[\p{Lu}][\p{L}\s]{0,128}$/u,
                                message: "Type must consist of letters, be capitalized and max 256 characters long"
                            }
                        })}
                        error={!!errors?.type}
                        helperText={errors?.type ? errors.type.message : null} 
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Name" 
                        inputRef={nameRef}
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
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Brand" 
                        inputRef={brandRef}
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
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Size" 
                        inputRef={sizeRef}
                        variant="outlined"
                        style={{width: 400}}
                        {...register("size", {
                            required: "Size is required",
                            pattern: {
                                value: /^[\p{L}0-9.]{0,128}$/u,
                                message: "Size must be one word with max 128 characters"
                            }
                        })}
                        error={!!errors?.size}
                        helperText={errors?.size ? errors.size.message : null} 
                    />

                    <Button type="submit" variant="contained" >Add gear</Button>
                    <Button variant="contained" onClick={routeChange}>Back</Button>
                </div>
            </form>
        </div>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} key={'bottom' + 'right'} open={showAlert !== null} autoHideDuration={3000} onClose={() => setShowAlert(null)}>
            <Alert severity={alertSeverity}>{showAlert}</Alert>
        </Snackbar>
    </>
    )
}
export default CreateGear