import React, { useState, useRef } from 'react'

import { Header } from '../../components';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { postDessert } from '../../api/dessertRequests';

import { Button, Alert, Snackbar } from '@mui/material';

import TextField from '@mui/material/TextField';

function CreateDessert() {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const caloriesRef = useRef(null);
    const costRef = useRef(null);
    const priceRef = useRef(null);


    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/desserts'; 
        navigate(path);
    }
    
    const {register, handleSubmit, formState: { errors }} = useForm();

    const onSubmit = async (data) => {
        const response = await postDessert(data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Dessert added successfully!");
        nameRef.current.value = "";
        descriptionRef.current.value = "";
        caloriesRef.current.value = "";
        costRef.current.value = "";
        priceRef.current.value = "";
        setTimeout(() => {
            routeChange();
        }, 1000);
    }

    return (
    <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Add dessert" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                    <TextField 
                        id="outlined-basic" 
                        label="Name" 
                        inputRef={nameRef}
                        variant="outlined"
                        style={{width: 400}}
                        {...register("name", {
                            required: "Name is required",
                            pattern: {
                                value: /^[\p{Lu}][\p{L}\s]{0,128}$/u,
                                message: "Name must consist of letters, be capitalized and max 128 characters long"
                            }
                        })}
                        error={!!errors?.name}
                        helperText={errors?.name ? errors.name.message : null} 
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Description" 
                        inputRef={descriptionRef}
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
                    />

                    <TextField 
                        id="outlined-basic"
                        type="number" 
                        label="Calories" 
                        inputRef={caloriesRef}
                        variant="outlined"
                        style={{width: 400}}
                        {...register("calories", {
                            required: "Calories are required",
                            pattern: {
                                value: /^\d*[1-9]\d*$/,
                                message: "Calories must be greater than 0"
                            }
                        })}
                        error={!!errors?.calories}
                        helperText={errors?.calories ? errors.calories.message : null}
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Preparation cost" 
                        inputRef={costRef}
                        variant="outlined"
                        style={{width: 400}}
                        {...register("cost", {
                            required: "Cost is required",
                            pattern: {
                                value: /^\d+(\.\d{1,2})?$/,
                                message: "Cost must be a positive number with max 2 decimal digits"
                            }
                        })}
                        error={!!errors?.cost}
                        helperText={errors?.cost ? errors.cost.message : null}
                    />

                    <TextField 
                        id="outlined-basic"
                        label="Menu price" 
                        inputRef={priceRef}
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
                    />

                    <Button type="submit" variant="contained" >Add dessert</Button>
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
export default CreateDessert