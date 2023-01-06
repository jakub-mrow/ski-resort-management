import React, { useState } from 'react'

import { Header } from '../../components';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { postEmployee } from '../../api/employeeRequests';

import { Button, Alert, Snackbar } from '@mui/material';

import TextField from '@mui/material/TextField';

function CreateEmployee() {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");


    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/employees'; 
        navigate(path);
    }
    
    const {register, handleSubmit, formState: { errors }} = useForm();

    const onSubmit = async (data) => {
        const response = await postEmployee(data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Employee added successfully!");
    }

    return (
    <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Add employee" />

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
                                message: "Number must consist of 11 digits"
                            }
                        })}
                        error={!!errors?.socialNum}
                        helperText={errors?.socialNum ? errors.socialNum.message : null}
                    />

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
                        label="Surname" 
                        variant="outlined"
                        {...register("surname", {required: "Surname is required"})}
                        error={!!errors?.surname}
                        helperText={errors?.surname ? errors.surname.message : null}   
                    />
                    <TextField 
                        id="outlined-basic" 
                        label="Job" 
                        variant="outlined" 
                        {...register("job", {required: "Job is required"})}
                        error={!!errors?.job}
                        helperText={errors?.job ? errors.job.message : null}   
                        
                    />

                    <TextField 
                        id="outlined-basic"
                        type="number" 
                        label="Salary" 
                        variant="outlined"
                        {...register("salary", {
                            required: "Salary is required",
                            pattern: {
                                value: /^\d*[1-9]\d*$/,
                                message: "Salary must be greater than 0"
                            }
                        })}
                        error={!!errors?.salary}
                        helperText={errors?.salary ? errors.salary.message : null}
                    />

                    <Button type="submit" variant="contained" >Add employee</Button>
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
export default CreateEmployee