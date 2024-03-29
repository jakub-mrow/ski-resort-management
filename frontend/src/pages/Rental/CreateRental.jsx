import React, { useEffect, useState, useRef } from 'react'

import { Header } from '../../components';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { postRental, getRentalCreateData } from '../../api/rentalRequests';
import { getGearUnavailabilty } from '../../api/gearRequests';

import { Button, Alert, Snackbar, Autocomplete } from '@mui/material';

// imports for date picker
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

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

    const[clearEmployee, setClearEmployee] = useState(Math.random().toString());
    const[clearGuest, setClearGuest] = useState(Math.random().toString());
    const[clearGear, setClearGear] = useState(Math.random().toString());

    const [unavailabiltyList, setUnavailabilityList] = useState(false);

    const priceRef = useRef(null);

    useEffect(() => {
        const fetchRentalOptionsdata = async () => {
            const data = await getRentalCreateData();
            setRentalOptionsData(data);
            setEmployeeSelect(Object.keys(data.employees).map((key) => { return `${data.employees[key].name} ${data.employees[key].surname}, ${data.employees[key].social_security_number}`;}));
            setGuestSelect(Object.keys(data.guests).map((key) => { return `${data.guests[key].name} ${data.guests[key].surname}, ${data.guests[key].social_security_number}`;}));
            setGearSelect(Object.keys(data.gear).map((key) => {return `${data.gear[key].name} ${data.gear[key].size}`}))
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

    const disableUnavailableDates = (date) => {
        const normalizedDate = dayjs(date).format('YYYY-MM-DD');
        const dates = unavailabiltyList;
        
        if (dates !== false){
            if (dates.includes(normalizedDate)){
                return true;
            }
        }
    }


    const onSubmit = async (data) => {
        data["date_from"] = dateFrom.toISOString().split('T')[0];
        data["date_to"] = dateTo.toISOString().split('T')[0];
        data["employee"] = getEmployeeIdBySocialNum(employee.split(" ")[employee.split(" ").length - 1]);
        data["guest"] = getGuestIdBySocialNum(guest.split(" ")[guest.split(" ").length - 1]);
        data["gear"] = getGearIdByGearName(gear.split(" ").slice(0, -1).join(" "));
        console.log(data);
        try{
            const response = await postRental(data);
            if (response) {
                setAlertSeverity("success");
                setShowAlert("Rental added successfully!");
                setClearEmployee(Math.random().toString());
                setClearGuest(Math.random().toString());
                setClearGear(Math.random().toString());
                priceRef.current.value = "";
                setTimeout(() => {
                    routeChange();
                }, 1000);
                return;
            }
        } catch (error){
            setAlertSeverity("error");
            const errorMsg = JSON.parse(error.message);
            if (errorMsg.hasOwnProperty("non_field_errors")){
                setShowAlert(errorMsg.non_field_errors)
                return
            }

            if (errorMsg.hasOwnProperty("msg")){
                setShowAlert(errorMsg.msg)
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

                    <Autocomplete
                        disablePortal
                        id="gearSelectBox"
                        key={clearGear}
                        style={{width: 400}}
                        onChange={(event, newValue) => {
                            setGear(newValue)
                            const getUnavailabiltyList = async (room_id) => {
                                const data = await getGearUnavailabilty(room_id);
                                setUnavailabilityList(data);
                            }
                            getUnavailabiltyList(getGearIdByGearName(newValue.split(" ").slice(0, -1).join(" ")));
                        }}
                        options={gearSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Gear" />}
                    />
                        

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date from"
                            inputFormat="MM-DD-YYYY"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                            disablePast={true}
                            shouldDisableDate={disableUnavailableDates}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DesktopDatePicker
                            label="Date to"
                            inputFormat="MM-DD-YYYY"
                            value={dateTo}
                            onChange={handleDateToChange}
                            disablePast={true}
                            shouldDisableDate={disableUnavailableDates}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>


                    <Autocomplete
                        disablePortal
                        id="employeeSelectBox"
                        key={clearEmployee}
                        style={{width: 400}}
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
                        key={clearGuest}
                        style={{width: 400}}
                        onChange={(event, newValue) => {
                            setGuest(newValue);
                        }}
                        options={guestSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Guest" />}
                    />


                    <TextField 
                        id="outlined-basic" 
                        label="Price"
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


                    <Button type="submit" variant="contained" >Add rental</Button>
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

export default CreateRental;