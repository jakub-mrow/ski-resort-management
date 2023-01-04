import React, { useState } from 'react'

import { Header } from '../components';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { postDish } from '../api/dishRequests';

import { Button, Alert, Snackbar } from '@mui/material';

import TextField from '@mui/material/TextField';

function CreateDish() {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");


    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/dishes'; 
        navigate(path);
    }
    
    const {register, handleSubmit, formState: { errors }} = useForm();

    const onSubmit = async (data) => {
        const response = await postDish(data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Dish added successfully!");
    }

    return (
    <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Add dish" />

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
                        label="Description" 
                        variant="outlined"
                        {...register("description", {required: "Description is required"})}
                        error={!!errors?.description}
                        helperText={errors?.description ? errors.description.message : null} 
                    />

                    <TextField 
                        id="outlined-basic"
                        type="number" 
                        label="Calories" 
                        variant="outlined"
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
                        variant="outlined"
                        {...register("cost", {
                            required: "Cost is required",
                            pattern: {
                                value: /^\d+(\.\d{1,2})?$/,
                                message: "Cost must have max 2 decimal digits"
                            }
                        })}
                        error={!!errors?.cost}
                        helperText={errors?.cost ? errors.cost.message : null}
                    />

                    <TextField 
                        id="outlined-basic"
                        label="Menu price" 
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

                    <Button type="submit" variant="contained" >Add dish</Button>
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
export default CreateDish