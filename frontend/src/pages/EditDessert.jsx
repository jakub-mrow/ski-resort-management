import React, { useEffect, useState } from 'react'

import { Header } from '../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateDessert, getDessert } from '../api/dessertRequests';
import { useStateContext } from '../context/ContextProvider';

import { Button, Alert, Snackbar } from '@mui/material';


import TextField from '@mui/material/TextField';

const EditDessert = () => {
    const {register, handleSubmit, formState: { errors }} = useForm();
    const { dessertObject, setDessertObject } = useStateContext();
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const params = useParams();

    useEffect(() => {
        const fetchDessert = async () => {
            const data = await getDessert(params.id)
        }
        const fetchOrRedirect = async () => {
            try {
                await fetchDessert();
            } catch(error) {
                routeChange();
            }
        }

        fetchOrRedirect();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/desserts'; 
        navigate(path);
    }

    const onSubmit = async (data) => {
        const response = await updateDessert(params.id, data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Dish edited successfully!");
    }


    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Page" title="Edit dessert" />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="flex flex-col space-y-4 mx-auto justify-center items-center">

                        <TextField 
                            id="outlined-basic" 
                            label="Name" 
                            variant="outlined"
                            {...register("name", {required: "Name is required"})}
                            error={!!errors?.name}
                            helperText={errors?.name ? errors.name.message : null} 
                            defaultValue={dessertObject.name}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Description" 
                            variant="outlined"
                            {...register("description", {required: "Description is required"})}
                            error={!!errors?.description}
                            helperText={errors?.description ? errors.description.message : null} 
                            defaultValue={dessertObject.description}
                        />

                        <TextField 
                            id="outlined-basic"
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
                            defaultValue={dessertObject.calories}
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
                            defaultValue={dessertObject.cost}
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
                            defaultValue={dessertObject.price}
                        />

                        <Button type="submit" variant="contained">Edit dessert</Button>
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
export default EditDessert;