import React, { useEffect, useState } from 'react'

import { Header } from '../../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateEmployee, getEmployee } from '../../api/employeeRequests';
import { useStateContext } from '../../context/ContextProvider';

import { Button, Alert, Snackbar } from '@mui/material';


import TextField from '@mui/material/TextField';

const EditEmployee = () => {
    const {register, handleSubmit, formState: { errors }} = useForm();
    const { employeeObject, setEmployeeObject } = useStateContext();
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const params = useParams();

    useEffect(() => {
        const fetchEmployee = async () => {
            const data = await getEmployee(params.id)
        }
        const fetchOrRedirect = async () => {
            try {
                await fetchEmployee();
            } catch(error) {
                routeChange();
            }
        }

        fetchOrRedirect();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/employees'; 
        navigate(path);
    }

    const onSubmit = async (data) => {
        try{
            console.log(data);
            const response = await updateEmployee(params.id, data);
            if (response) {
                setAlertSeverity("success");
                setShowAlert("Employee edited successfully!");
                routeChange();
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
                <Header category="Page" title="Edit employee" />

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
                            error={!!errors?.social_security_number}
                            helperText={errors?.social_security_number ? errors.social_security_number.message : null}
                            defaultValue={employeeObject.social_security_number}
                        />

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
                            defaultValue={employeeObject.name} 
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Surname" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("surname", {
                                required: "Surname is required",
                                pattern: {
                                    value: /^[\p{Lu}][\p{L}\s-]{0,128}$/u,
                                    message: "Surname must consist of letters, be capitalized and max 128 characters long"
                                }
                            })}
                            error={!!errors?.surname}
                            helperText={errors?.surname ? errors.surname.message : null}
                            defaultValue={employeeObject.surname}   
                        />
                        <TextField 
                            id="outlined-basic" 
                            label="Job" 
                            variant="outlined" 
                            style={{width: 400}}
                            {...register("job", {
                                required: "Job is required",
                                pattern: {
                                    value: /^[\p{Lu}][\s\p{L}]{0,128}$/u,
                                    message: "Job must consist of letters, be capitalized and max 128 characters long"
                                }
                            })}
                            error={!!errors?.job}
                            helperText={errors?.job ? errors.job.message : null}
                            defaultValue={employeeObject.job}   
                            
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Salary" 
                            variant="outlined" 
                            style={{width: 400}}
                            {...register("salary", {
                                required: "Salary is required",
                                pattern: {
                                    value: /^\d+(\.\d{1,2})?$/,
                                    message: "Salary must be a positive number with max 2 decimal digits"
                                }
                            })}
                            error={!!errors?.salary}
                            helperText={errors?.salary ? errors.salary.message : null}
                            defaultValue={employeeObject.salary}   
                            
                        />

                        <Button type="submit" variant="contained">Edit employee</Button>
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
export default EditEmployee;