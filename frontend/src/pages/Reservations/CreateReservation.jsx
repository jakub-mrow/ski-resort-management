import React, { useEffect, useState, useRef } from 'react'

import { Header } from '../../components';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { postReservation, getReservationCreateData } from '../../api/reservationRequests';
import { getRoom, getRoomUnavailabilty } from '../../api/roomRequests';

import { Button, Alert, Snackbar, Autocomplete } from '@mui/material';

// imports for date picker
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import TextField from '@mui/material/TextField';


function CreateReservation() {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");
    const [reservationOptionsData, setReservationOptionsData] = useState({});

    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());

    const [employeeSelect, setEmployeeSelect] = useState([]);
    const [guestSelect, setGuestSelect] = useState([]);
    const [roomSelect, setRoomSelect] = useState([]);

    const [employee, setEmployee] = useState("");
    const [guest, setGuest] = useState("");
    const [room, setRoom] = useState(0);

    const[clearEmployee, setClearEmployee] = useState(Math.random().toString());
    const[clearGuest, setClearGuest] = useState(Math.random().toString());
    const[clearRoom, setClearRoom] = useState(Math.random().toString());
    
    const numberRef = useRef(null);

    const [unavailabiltyList, setUnavailabilityList] = useState(false);

    useEffect(() => {
        const fetchReservationOptionsdata = async () => {
            const data = await getReservationCreateData();
            setReservationOptionsData(data);
            setEmployeeSelect(Object.keys(data.employees).map((key) => { return `${data.employees[key].name} ${data.employees[key].surname}, ${data.employees[key].social_security_number}`;}));
            setGuestSelect(Object.keys(data.guests).map((key) => { return `${data.guests[key].name} ${data.guests[key].surname}, ${data.guests[key].social_security_number}`;}));
            setRoomSelect(Object.keys(data.rooms).map((key) => {return String(data.rooms[key].room_id)}))
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
            if (reservationOptionsData.employees[i].social_security_number == socialNum){
                return reservationOptionsData.employees[i].id;
            }
        }
    }

    const getGuestIdBySocialNum = (socialNum) => {
        for (let i in reservationOptionsData.guests){
            if (reservationOptionsData.guests[i].social_security_number == socialNum){
                return reservationOptionsData.guests[i].id;
            }
        }
    }

    const onSubmit = async (data) => {
        data["date_from"] = dateFrom.toISOString().split('T')[0];
        data["date_to"] = dateTo.toISOString().split('T')[0];
        data["employee"] = getEmployeeIdBySocialNum(employee.split(" ")[employee.split(" ").length - 1]);
        data["guest"] = getGuestIdBySocialNum(guest.split(" ")[guest.split(" ").length - 1]);
        data["room"] = parseInt(room);
        console.log(data);

        try{
            const response = await postReservation(data);
            if (response) {
                setAlertSeverity("success");
                setShowAlert("Reservation added successfully!");
                setClearEmployee(Math.random().toString());
                setClearGuest(Math.random().toString());
                setClearRoom(Math.random().toString());
                numberRef.current.value = "";
                return;
            }
        } catch (error){
            setAlertSeverity("error");
            const errorMsg = JSON.parse(error.message);
            if ("msg" in errorMsg){
                setShowAlert(errorMsg.msg);
            } else {
                setShowAlert("Internal server error. Redo the operation or contact administrator.")
            }
        }
    }

    const handleDateFromChange = (newDate) => {
        setDateFrom(newDate);
    }

    const handleDateToChange = (newDate) => {
        setDateTo(newDate);
    }

    const disableUnavailableDates = (date) => {
        const normalizedDate = date.toISOString().split("T")[0];
        const dates = unavailabiltyList;

        if (dates !== false){
            if (dates.includes(normalizedDate)){
                console.log(normalizedDate)
                return true;
            }
        }

    }


    return (
        <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Add reservation" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                        
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date from Picker"
                            inputFormat="MM-DD-YYYY"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                            disablePast={true}
                            shouldDisableDate={disableUnavailableDates}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DesktopDatePicker
                            label="Date to Picker"
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

                    <Autocomplete
                        disablePortal
                        id="roomSelectBox"
                        key={clearRoom}
                        style={{width: 400}}
                        onChange={(event, newValue) => {
                            setRoom(newValue);
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
                        inputRef={numberRef}
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
                        error={!!errors?.number_of_people}
                        helperText={errors?.number_of_people ? errors.number_of_people.message : null} 
                    />


                    <Button type="submit" variant="contained" >Add reservation</Button>
                    <Button variant="contained" onClick={routeChange}>Back</Button>
                </div>
            </form>
        </div>
<<<<<<< HEAD
        <Snackbar open={showAlert !== null} autoHideDuration={6000} onClose={() => setShowAlert(null)}>
=======
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} key={'bottom' + 'right'} open={showAlert !== null} autoHideDuration={3000} onClose={() => setShowAlert(null)}>
>>>>>>> ce2b4e4723e2aa26dff2aa64604a6814e1a7c122
            <Alert severity={alertSeverity}>{showAlert}</Alert>
        </Snackbar>
    </>
    )
}

export default CreateReservation;