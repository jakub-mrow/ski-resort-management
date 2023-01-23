import React, { useEffect, useState } from 'react'

import { Header } from '../../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateRental, getRentalCreateData, getRental } from '../../api/rentalRequests';
import { getGearUnavailabilty } from '../../api/gearRequests';

import { Button, Alert, Snackbar, Autocomplete } from '@mui/material';

// imports for date picker
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import TextField from '@mui/material/TextField';
import { useStateContext } from '../../context/ContextProvider';

import dayjs from 'dayjs';


const EditRental = () => {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");
    const [rentalOptionsData, setRentalOptionsData] = useState({});

    const { rentalObject, setRentalObject } = useStateContext();

    const [dateFrom, setDateFrom] = useState(new Date(rentalObject.date_from));
    const [dateTo, setDateTo] = useState(new Date(rentalObject.date_to));

    const [employeeSelect, setEmployeeSelect] = useState([]);
    const [guestSelect, setGuestSelect] = useState([]);
    const [gearSelect, setGearSelect] = useState([]);

    const [employee, setEmployee] = useState("");
    const [guest, setGuest] = useState("");
    const [gear, setGear] = useState("");

    const [unavailabiltyList, setUnavailabilityList] = useState(false);

    const params = useParams();

    const generateDateRange = (start, end) => {
        let dateArr = [];
        let current = new Date(start);
        let last = new Date(end);
        while (current <= last) {
            dateArr.push(current.toISOString().slice(0, 10));
            current.setDate(current.getDate() + 1);
        }
        return dateArr;
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await getRentalCreateData();
            setRentalOptionsData(data);
            setEmployeeSelect(Object.keys(data.employees).map((key) => { return `${data.employees[key].name} ${data.employees[key].surname}, ${data.employees[key].social_security_number}`;}));
            setGuestSelect(Object.keys(data.guests).map((key) => { return `${data.guests[key].name} ${data.guests[key].surname}, ${data.guests[key].social_security_number}`;}));
            setGearSelect(Object.keys(data.gear).map((key) => {return `${data.gear[key].name} ${data.gear[key].size}`}))
        }

        fetchData();
    }, []);

    useEffect(() => {
        const getUnavailabiltyList = async (gear_id) => {
            const data = await getGearUnavailabilty(gear_id);
            const datesToExclude = generateDateRange(rentalObject.date_from, rentalObject.date_to);
            for (let i = 0; i < data.length; i++) {
                if (datesToExclude.includes(data[i])){
                    data.splice(i, 1);
                    i--;
                }
            }
            setUnavailabilityList(data);
        }

        const fetchRentalOptionsdata = async () => {
            const specificRentalData = await getRental(params.id);

            setGuest(`${specificRentalData.guest.name} ${specificRentalData.guest.surname}, ${specificRentalData.guest.social_security_number}`);
            setEmployee(`${specificRentalData.employee.name} ${specificRentalData.employee.surname}, ${specificRentalData.employee.social_security_number}`);
            setGear(`${specificRentalData.gear.name} ${specificRentalData.gear.size}`);

            if (Object.keys(rentalOptionsData).length !== 0) {
                getUnavailabiltyList(await getGearIdByGearName(specificRentalData.gear.name, specificRentalData.gear.size));
            }
        }

        fetchRentalOptionsdata();
    }, [rentalOptionsData]);

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

    const getGearIdByGearName = (gearName, gearSize) => {
        for (let i in rentalOptionsData.gear){
            if ((rentalOptionsData.gear[i].name === gearName) && (rentalOptionsData.gear[i].size === gearSize)){
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
        if (employee !== ""){
            data["employee"] = getEmployeeIdBySocialNum(employee.split(" ")[employee.split(" ").length - 1]);
        }
        if (employee !== ""){
            data["guest"] = getGuestIdBySocialNum(guest.split(" ")[guest.split(" ").length - 1]);
        }
        if (employee !== ""){
            data["gear"] = getGearIdByGearName(gear.split(" ").slice(0, -1).join(" "), gear.split(" ")[gear.split(" ").length - 1]);
        }
        console.log(data);
        try{
            const response = await updateRental(params.id, data);
            if (response) {
                setAlertSeverity("success");
                setShowAlert("Rental edited successfully!");
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

    const disableUnavailableDates = (date) => {
        const normalizedDate = dayjs(date).format('YYYY-MM-DD');
        const dates = unavailabiltyList;
        
        if (dates !== false){
            if (dates.includes(normalizedDate)){
                return true;
            }
        }
    }


    return (
        <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Edit rental" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                        
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date from Picker"
                            inputFormat="MM-DD-YYYY"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                            //disablePast={true}
                            shouldDisableDate={disableUnavailableDates}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DesktopDatePicker
                            label="Date to Picker"
                            inputFormat="MM-DD-YYYY"
                            value={dateTo}
                            onChange={handleDateToChange}
                            //disablePast={true}
                            shouldDisableDate={disableUnavailableDates}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>


                    <Autocomplete
                        disablePortal
                        id="employeeSelectBox"
                        style={{width: 400}}
                        value={employee}
                        onChange={(event, newValue) => {
                            if (Object.is(newValue, null)){
                                setEmployee("");
                            } else {
                                setEmployee(newValue);
                            }
                        }}
                        options={employeeSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Employee" />}
                    />


                    <Autocomplete
                        disablePortal
                        id="guestSelectBox"
                        style={{width: 400}}
                        value={guest}
                        onChange={(event, newValue) => {
                            if (Object.is(newValue, null)){
                                setGuest("");
                            } else {
                                setGuest(newValue);
                            }
                        }}
                        options={guestSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Guest" />}
                    />

                    <Autocomplete
                        disablePortal
                        id="gearSelectBox"
                        style={{width: 400}}
                        value={gear}
                        onChange={(event, newValue) => {
                            if (Object.is(newValue, null)){
                                setGear("");
                            } else {
                                setGear(newValue);
                                const getUnavailabiltyList = async (room_id) => {
                                    const data = await getGearUnavailabilty(room_id);
                                    setUnavailabilityList(data);
                                }
                                getUnavailabiltyList(getGearIdByGearName(newValue.split(" ").slice(0, -1).join(" ")));
                            }
                            
                        }}
                        options={gearSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Gear" />}
                    />

                    <TextField 
                        id="outlined-basic" 
                        label="Price"
                        variant="outlined"
                        defaultValue={rentalObject.price}
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


                    <Button type="submit" variant="contained" >Edit rental</Button>
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

export default EditRental;