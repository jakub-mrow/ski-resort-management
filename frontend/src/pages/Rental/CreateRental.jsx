import React, { useEffect, useState } from 'react'

import { Header } from '../../components';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { postRental, getRentalCreateData } from '../../api/rentalRequests';

import { Button, Alert, Snackbar, Autocomplete } from '@mui/material';

// imports for date picker
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import TextField from '@mui/material/TextField';


const CreateRental = () => {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");
    const [rentalOptionsData, setRentalOptionsData] = useState({});

    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());

    const [employeeSelect, setEmployeeSelect] = useState([]);
    const [guestSelect, setGuestSelect] = useState([]);
    const [gearSelect, setGearSelect] = useState([]);

    const [employee, setEmployee] = useState("");
    const [guest, setGuest] = useState("");
    const [gear, setGear] = useState("");

    useEffect(() => {
        const fetchRentalOptionsdata = async () => {
            const data = await getRentalCreateData();
            setRentalOptionsData(data);
            setEmployeeSelect(Object.keys(data.employees).map((key) => { return `${data.employees[key].name} ${data.employees[key].surname} ${data.employees[key].social_security_number}`;}));
            setGuestSelect(Object.keys(data.guests).map((key) => { return `${data.guests[key].name} ${data.guests[key].surname} ${data.guests[key].social_security_number}`;}));
            setGearSelect(Object.keys(data.gear).map((key) => {return String(data.gear[key].name)}))
        }
        fetchRentalOptionsdata();
    }, [])


    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/rentals`; 
        navigate(path);
    }


    const {register, handleSubmit, formState: { errors }} = useForm();

    const getEmployeeIdBySocialNum = (socialNum) => {
        for (let i in rentalOptionsData.employees){
            if (rentalOptionsData.employees[i].social_security_number == socialNum){
                return rentalOptionsData.employees[i].id;
            }
        }
    }

    const getGuestIdBySocialNum = (socialNum) => {
        console.log(rentalOptionsData);
        for (let i in rentalOptionsData.guests){
            if (rentalOptionsData.guests[i].social_security_number == socialNum){
                return rentalOptionsData.guests[i].id;
            }
        }
    }

    const getGearIdByGearName = (gearName) => {
        for (let i in rentalOptionsData.gear){
            if (rentalOptionsData.gear[i].name == gearName){
                return rentalOptionsData.gear[i].id;
            }
        }
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    const onSubmit = async (data) => {
        data["date_from"] = dateFrom.toISOString().split('T')[0];
        data["date_to"] = dateTo.toISOString().split('T')[0];
        data["employee"] = getEmployeeIdBySocialNum(employee.split(" ")[2]);
        data["guest"] = getGuestIdBySocialNum(guest.split(" ")[2]);
        data["gear"] = getGearIdByGearName(gear);
        console.log(data);
        try{
            const response = await postRental(data);
            if (response) {
                setAlertSeverity("success");
                setShowAlert("Rental added successfully!");
                return;
            }
        } catch (error){
            const errorMsg = JSON.parse(error.message);
            if (errorMsg.hasOwnProperty("non_field_errors")){
                setShowAlert(errorMsg.non_field_errors)
                return
            }
            console.log(errorMsg);
            let errorUserResponse = ""
            for (const [key, value] of Object.entries(errorMsg)){
                const splitted = value[0].split(" ");
                splitted.shift()
                const joined = splitted.join(" ")
                errorUserResponse += `${capitalizeFirstLetter(key)} ${joined} `
            }
            setShowAlert(errorUserResponse);
        }

    }

    const handleDateFromChange = (newDate) => {
        setDateFrom(newDate);
    }

    const handleDateToChange = (newDate) => {
        setDateTo(newDate);
    }


    return (
        <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Add rental" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                        
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date from Picker"
                            inputFormat="MM-DD-YYYY"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                            disablePast={true}
                            //shouldDisableDate={disableUnavailableDates}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DesktopDatePicker
                            label="Date to Picker"
                            inputFormat="MM-DD-YYYY"
                            value={dateTo}
                            onChange={handleDateToChange}
                            disablePast={true}
                            //shouldDisableDate={disableUnavailableDates}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>


                    <Autocomplete
                        disablePortal
                        id="employeeSelectBox"
                        onChange={(event, newValue) => {
                            setEmployee(newValue);
                        }}
                        options={employeeSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Employee" />}
                    />


                    <Autocomplete
                        disablePortal
                        id="guestSelectBox"
                        onChange={(event, newValue) => {
                            setGuest(newValue);
                        }}
                        options={guestSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Guest" />}
                    />

                    <Autocomplete
                        disablePortal
                        id="gearSelectBox"
                        onChange={(event, newValue) => {
                            setGear(newValue);
                        }}
                        options={gearSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Gear" />}
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Price"
                        type="number" 
                        variant="outlined"
                        {...register("price", {
                            required: "Price is required",
                            pattern: {
                                value: /^[0-9]*\.?[0-9]+$/,
                                message: "Number must be positive"
                            }
                        })}
                        error={!!errors?.price}
                        helperText={errors?.price ? errors.price.message : null} 
                    />


                    <Button type="submit" variant="contained" >Add rental</Button>
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

export default CreateRental;