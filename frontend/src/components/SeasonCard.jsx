import React, { useEffect } from 'react'
import { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Button, Alert, Snackbar } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { decreasePrices, increasePrices } from '../api/procedureRequests';

import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    guestCount: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        marginBottom: theme.spacing(2),
    },
    infoLabel1: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        marginBottom: theme.spacing(2),
    },
    infoLabel2: {
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(2),
    },
    card: {
        borderRadius: '10px',
    },
    button: {
        padding: '10px 20px',

      },
}));

const SeasonCard = ({ title, textToDisplay, procedureName, procedureNameNice, action, icon }) => {
    const classes = useStyles();

    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const { register, handleSubmit, formState: { errors } } = useForm();


    const onSubmit = async (data) => {
        try {
            if (procedureName == "decrease_prices") {
                const response = await decreasePrices(data);
                if (response) {
                    setAlertSeverity("success");
                    setShowAlert("Price decreased successfully!");
                    return;
                }
            } else if (procedureName == "increase_prices") {
                const response = await increasePrices(data);
                if (response) {
                    setAlertSeverity("success");
                    setShowAlert("Price increased successfully!");
                    return;
                }
            }

        } catch (error) {
            setAlertSeverity("error");
            const errorMsg = JSON.parse(error.message);
            if ("msg" in errorMsg) {
                setShowAlert(errorMsg.msg);
            }
        }
    }

    return (
        <>
            <Card className={classes.card} sx={{ maxWidth: 1000, minWidth: 300 }}>
                <CardContent>
                    <Typography className={classes.infoLabel1} align='left'>{title}</Typography>
                    <Typography className={classes.infoLabel2} align='left'>{textToDisplay}</Typography>
                </CardContent>
                <CardActions>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                            <TextField
                                id="outlined-basic"
                                type="number"
                                label="Percent"
                                variant="outlined"
                                style={{ width: 300 }}
                                {...register(action, {
                                    required: "Percent is required",
                                    pattern: {
                                        value: /^\d*[1-9]\d*$/,
                                        message: "Percent must be greater than 0"
                                    }
                                })}
                                error={!!errors?.[action]}
                                helperText={errors?.[action] ? errors?.[action].message : null}
                            />
                            <Button type="submit" className={classes.button} variant="contained" style={action == 'increase' ? { backgroundColor: "#21b6ae" } : { backgroundColor: "#e31809" }}>{procedureNameNice}</Button>
                        </div>
                    </form>
                </CardActions>
            </Card>
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} key={'bottom' + 'right'} open={showAlert !== null} autoHideDuration={5000} onClose={() => setShowAlert(null)}>
                <Alert severity={alertSeverity}>{showAlert}</Alert>
            </Snackbar>
        </>
    );
}
export default SeasonCard;