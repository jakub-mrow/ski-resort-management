import React, { useEffect, useState } from 'react'

import { Header } from '../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useStateContext } from '../context/ContextProvider';

import { getReservationCreateData, updateReservation } from '../api/reservationRequests';

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

    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());

    const [employeeSelect, setEmployeeSelect] = useState([]);
    const [guestSelect, setGuestSelect] = useState([]);
    const [roomSelect, setRoomSelect] = useState([]);

    const [employee, setEmployee] = useState("");
    const [guest, setGuest] = useState("");
    const [room, setRoom] = useState(0);

    const { reservationObject, setReservationObject } = useStateContext();
    const params = useParams();

    useEffect(() => {
        const fetchReservationOptionsdata = async () => {
            const data = await getReservationCreateData();
            setReservationOptionsData(data);
            setEmployeeSelect(Object.keys(data.employees).map((key) => { return `${data.employees[key].name} ${data.employees[key].surname} ${data.employees[key].social_security_number}`;}));
            setGuestSelect(Object.keys(data.guests).map((key) => { return `${data.guests[key].name} ${data.guests[key].surname} ${data.guests[key].social_security_number}`;}));
            setRoomSelect(Object.keys(data.rooms).map((key) => {return String(data.rooms[key].room_id)}))
            // let emptyObject = {};
            // setReservationOptionsData({emptyObject, ...employeeObject});
            // setTimeout(() => console.log(employeeObject), 3000);
            console.log(reservationObject);
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

    const getRoomIdById = (roomId) => {
        for (let i in reservationOptionsData.rooms){
            if (reservationOptionsData.rooms[i].room_id === roomId){
                return reservationOptionsData.rooms[i].id;
            }
        }
    }

    const onSubmit = async (data) => {
        data["date_from"] = dateFrom.toISOString().split('T')[0];
        data["date_to"] = dateTo.toISOString().split('T')[0];
        data["employee"] = getEmployeeIdBySocialNum(employee.split(" ")[2]);
        data["guest"] = getGuestIdBySocialNum(guest.split(" ")[2]);
        data["room"] = getRoomIdById(parseInt(room));

        const response = await updateReservation(params.id, data);
        if (!response) {
            setShowAlert("Internal server error");
            return;
        }

        setAlertSeverity("success");
        setShowAlert("Guest added successfully!");
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
            <Header category="Page" title="Update reservation" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-4 mx-auto justify-center items-center">
                        
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date from Picker"
                            inputFormat="MM/DD/YYYY"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                            //disablePast={true}
                            default={reservationObject.date_from}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DesktopDatePicker
                            label="Date to Picker"
                            inputFormat="MM/DD/YYYY"
                            value={dateTo}
                            onChange={handleDateToChange}
                            disablePast={true}
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
                        id="roomSelectBox"
                        onChange={(event, newValue) => {
                            setRoom(newValue);
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
                        {...register("number_of_people", {required: "Number of people is required"})}
                        error={!!errors?.number_of_people}
                        helperText={errors?.number_of_people ? errors.number_of_people.message : null} 
                    />


                    <Button type="submit" variant="contained" >Update reservation</Button>
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

export default EditReservation;