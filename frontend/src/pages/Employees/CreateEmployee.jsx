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
        try{
            const response = await postEmployee(data);
            if (response) {
                setAlertSeverity("success");
                setShowAlert("Employee added successfully!");
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
            <Header category="Page" title="Add employee" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                    <TextField 
                        id="outlined-basic"
                        type="number" 
                        label="Social security number" 
                        variant="outlined"
                        style={{width: 400}}
                        {...register("social_security_number", {
                            required: "Social security number is required",
                            pattern: {
                                value: /^\d{11}$/,
                                message: "Number must consist of 11 digits and be positive"
                            }
                        })}
                        error={!!errors?.socialNum}
                        helperText={errors?.socialNum ? errors.socialNum.message : null}
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Name" 
                        variant="outlined"
                        style={{width: 400}}
                        {...register("name", {
                            required: "Name is required",
                            pattern: {
                                value: /^[\s\p{L}]+$/u,
                                message: "Name must consist of only letters"
                            }
                        })}
                        error={!!errors?.name}
                        helperText={errors?.name ? errors.name.message : null} 
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Surname" 
                        variant="outlined"
                        style={{width: 400}}
                        {...register("surname", {
                            required: "Surname is required",
                            pattern: {
                                value: /^[\s\p{L}]+$/u,
                                message: "Surname must consist of only letters"
                            }
                        })}
                        error={!!errors?.surname}
                        helperText={errors?.surname ? errors.surname.message : null}   
                    />
                    <TextField 
                        id="outlined-basic" 
                        label="Job" 
                        variant="outlined" 
                        style={{width: 400}}
                        {...register("job", {
                            required: "Job is required",
                            pattern: {
                                value: /^[\s\p{L}]+$/u,
                                message: "Job must consist of only letters"
                            }
                        })}
                        error={!!errors?.job}
                        helperText={errors?.job ? errors.job.message : null}   
                        
                    />

                    <TextField 
                        id="outlined-basic"
                        label="Salary" 
                        variant="outlined"
                        style={{width: 400}}
                        {...register("salary", {
                            required: "Salary is required",
                            pattern: {
                                //value: /^\d*[1-9]\d*$/,
                                value: /^\d+(\.\d{1,2})?$/,
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