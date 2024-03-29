import React, { useEffect, useState } from 'react'

import { Header } from '../../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateDish, getDish } from '../../api/dishRequests';
import { useStateContext } from '../../context/ContextProvider';

import { Button, Alert, Snackbar } from '@mui/material';


import TextField from '@mui/material/TextField';

const EditDish = () => {
    const {register, handleSubmit, formState: { errors }} = useForm();
    const { dishObject, setDishObject } = useStateContext();
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const params = useParams();

    useEffect(() => {
        const fetchDish = async () => {
            const data = await getDish(params.id)
        }
        const fetchOrRedirect = async () => {
            try {
                await fetchDish();
            } catch(error) {
                routeChange();
            }
        }

        fetchOrRedirect();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/dishes'; 
        navigate(path);
    }

    const onSubmit = async (data) => {
        const response = await updateDish(params.id, data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Dish edited successfully!");
        setTimeout(() => {
            routeChange();
        }, 1000);
    }


    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Page" title="Edit dish" />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="flex flex-col space-y-4 mx-auto justify-center items-center">

                        <TextField 
                            id="outlined-basic" 
                            label="Name" 
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
                            defaultValue={dishObject.name}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Description" 
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
                            defaultValue={dishObject.description}
                        />

                        <TextField 
                            id="outlined-basic"
                            label="Calories" 
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
                            defaultValue={dishObject.calories}
                        />

                        <TextField 
                            id="outlined-basic"
                            label="Preparation cost" 
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
                            defaultValue={dishObject.cost}
                        />

                        <TextField 
                            id="outlined-basic"
                            label="Menu price" 
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
                            defaultValue={dishObject.price}
                        />

                        <Button type="submit" variant="contained">Edit dish</Button>
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
export default EditDish;