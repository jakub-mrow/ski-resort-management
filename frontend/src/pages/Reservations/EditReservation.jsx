import React, { useEffect, useState } from 'react'

import { Header } from '../../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useStateContext } from '../../context/ContextProvider';

import { getReservationCreateData, updateReservation, getReservation } from '../../api/reservationRequests';
import { getRoomUnavailabilty } from '../../api/roomRequests';

import { Button, Alert, Snackbar, Autocomplete } from '@mui/material';

// imports for date picker
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import TextField from '@mui/material/TextField';

function EditReservation() {

    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");
    const [reservationOptionsData, setReservationOptionsData] = useState({});

    const { reservationObject, setReservationObject } = useStateContext();

    const [dateFrom, setDateFrom] = useState(new Date(reservationObject.date_from));
    const [dateTo, setDateTo] = useState(new Date(reservationObject.date_to));

    const [employeeSelect, setEmployeeSelect] = useState([]);
    const [guestSelect, setGuestSelect] = useState([]);
    const [roomSelect, setRoomSelect] = useState([]);

    const [employee, setEmployee] = useState("");
    const [guest, setGuest] = useState("");
    const [room, setRoom] = useState(undefined);

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
        const fetchReservationOptionsdata = async () => {
            const data = await getReservationCreateData();
            const specificReservationData = await getReservation(params.id);

            setReservationOptionsData(data);
            setEmployeeSelect(Object.keys(data.employees).map((key) => { return `${data.employees[key].name} ${data.employees[key].surname}, ${data.employees[key].social_security_number}`;}));
            setGuestSelect(Object.keys(data.guests).map((key) => { return `${data.guests[key].name} ${data.guests[key].surname}, ${data.guests[key].social_security_number}`;}));
            setRoomSelect(Object.keys(data.rooms).map((key) => {return String(data.rooms[key].room_id)}))

            setGuest(`${specificReservationData.guest.name} ${specificReservationData.guest.surname}, ${specificReservationData.guest.social_security_number}`);
            setRoom(reservationObject.room);
            setEmployee(`${specificReservationData.employee.name} ${specificReservationData.employee.surname}, ${specificReservationData.employee.social_security_number}`);

            const getUnavailabiltyList = async (room_id) => {
                const data = await getRoomUnavailabilty(room_id);
                const datesToExclude = generateDateRange(reservationObject.date_from, reservationObject.date_to);
                for (let i = 0; i < data.length; i++) {
                    if (datesToExclude.includes(data[i])){
                        data.splice(i, 1);
                        i--;
                    }
                }
                setUnavailabilityList(data);
            }
            getUnavailabiltyList(reservationObject.room);

        }
        fetchReservationOptionsdata();
    }, [])

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/reservations`; 
        navigate(path);
    }

    const {register, handleSubmit, formState: { errors }} = useForm();

    const getEmployeeIdBySocialNum = (socialNum) => {
        for (let i in reservationOptionsData.employees){
            if (reservationOptionsData.employees[i].social_security_number === socialNum){
                return reservationOptionsData.employees[i].id;
            }
        }
    }

    const getGuestIdBySocialNum = (socialNum) => {
        for (let i in reservationOptionsData.guests){
            if (reservationOptionsData.guests[i].social_security_number === socialNum){
                return reservationOptionsData.guests[i].id;
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
            console.log("EMPLOYEE not EMPTY")
            data["employee"] = getEmployeeIdBySocialNum(employee.split(" ")[employee.split(" ").length - 1]);
        }
        if (guest !== ""){
            console.log("guest not empty")
            data["guest"] = getGuestIdBySocialNum(guest.split(" ")[guest.split(" ").length - 1]);
        }

        if (typeof(room) === 'string'){
            data["room"] = parseInt(room)
        } else {
            data["room"] = room;
        }

        console.log(data)
        try {
            const response = await updateReservation(params.id, data);
            if (response){
                setAlertSeverity("success");
                setShowAlert("Reservation edited successfully!");
                setTimeout(() => {
                    routeChange();
                }, 1000);
                return;
            }
        } catch (error) {
            setAlertSeverity("error");
            const errorMsg = JSON.parse(error.message);
            console.log(errorMsg)
            if (errorMsg.hasOwnProperty("non_field_errors")){
                setShowAlert(errorMsg.non_field_errors)
                return
            }

            if (errorMsg.hasOwnProperty("msg")){
                setShowAlert(errorMsg.msg)
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
            <Header category="Page" title="Update reservation" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-4 mx-auto justify-center items-center">
                        
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date from"
                            inputFormat="MM/DD/YYYY"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                            disablePast={true}
                            shouldDisableDate={disableUnavailableDates}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DesktopDatePicker
                            label="Date to"
                            inputFormat="MM/DD/YYYY"
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
                        id="roomSelectBox"
                        style={{width: 400}}
                        value={String(room)}
                        onChange={(event, newValue) => {
                            if (Object.is(newValue, null)){
                                setRoom("");
                            } else {
                                setRoom(newValue);
                            }
                            const getUnavailabiltyList = async (room_id) => {
                                const data = await getRoomUnavailabilty(room_id);
                                setUnavailabilityList(data);
                            }
                            getUnavailabiltyList(newValue);
                        }}
                        options={roomSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Room" />}
                    />



                    <TextField 
                        id="outlined-basic" 
                        label="Number of people"
                        type="number" 
                        variant="outlined"
                        style={{width: 400}}
                        {...register("number_of_people", {
                            required: "Number of people is required",
                            pattern: {
                                value: /^\d*[1-9]\d*$/,
                                message: "Number of people must be greater than 0"
                            }
                        })}
                        defaultValue={reservationObject.number_of_people}
                        error={!!errors?.number_of_people}
                        helperText={errors?.number_of_people ? errors.number_of_people.message : null} 
                    />


                    <Button type="submit" variant="contained" >Update reservation</Button>
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

export default EditReservation;