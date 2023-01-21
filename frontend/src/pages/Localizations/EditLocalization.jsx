import React, { useEffect, useState } from 'react'

import { Header } from '../../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateLocalization, getLocalization } from '../../api/localizationRequests';
import { useStateContext } from '../../context/ContextProvider';

import { Button, Alert, Snackbar } from '@mui/material';


import TextField from '@mui/material/TextField';

const EditLocalization = () => {
    const {register, handleSubmit, formState: { errors }} = useForm();
    const { localizationObject, setLocalizationObject } = useStateContext();
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const params = useParams();

    useEffect(() => {
        const fetchLocalization = async () => {
            const data = await getLocalization(params.id)
        }
        const fetchOrRedirect = async () => {
            try {
                await fetchLocalization();
            } catch(error) {
                routeChange();
            }
        }

        fetchOrRedirect();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = '/localizations'; 
        navigate(path);
    }

    const onSubmit = async (data) => {
        const response = await updateLocalization(params.id, data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Localization edited successfully!");
        routeChange();
    }


    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Page" title="Edit localization" />

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
                            defaultValue={localizationObject.name}
                        />

                        <TextField 
                            id="outlined-basic" 
                            label="Address" 
                            variant="outlined"
                            style={{width: 400}}
                            {...register("address", {
                                required: "Address is required",
                                pattern: {
                                    value: /^.{0,256}$/,
                                    message: "Address must be max 256 characters long"
                                }
                            })}
                            error={!!errors?.address}
                            helperText={errors?.address ? errors.address.message : null} 
                            defaultValue={localizationObject.address}
                        />

                        <Button type="submit" variant="contained">Edit localization</Button>
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
export default EditLocalization;