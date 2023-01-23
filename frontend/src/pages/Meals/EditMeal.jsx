import React, { useEffect, useState } from 'react'

import { Header } from '../../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateMeal, getMealCreateData, getMeal } from '../../api/mealRequests';

import { Button, Alert, Snackbar, Autocomplete } from '@mui/material';

// imports for date picker
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import TextField from '@mui/material/TextField';
import { useStateContext } from '../../context/ContextProvider';


const EditMeal = () => {
    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");
    const [mealOptionsData, setMealOptionsData] = useState({});

    const { mealObject, setMealObject } = useStateContext();

    const [date, setDate] = useState(new Date(mealObject.date));

    const [guestSelect, setGuestSelect] = useState([]);
    const [dishSelect, setDishSelect] = useState([]);
    const [dessertSelect, setDessertSelect] = useState([]);

    const [guest, setGuest] = useState("");
    const [dish, setDish] = useState("");
    const [dessert, setDessert] = useState("");


    const params = useParams();

    useEffect(() => {
      const fetchMealOptionsdata = async () => {
          const data = await getMealCreateData();
          const specificData = await getMeal(params.id);
          setMealOptionsData(data);
          setGuestSelect(Object.keys(data.guests).map((key) => { return `${data.guests[key].name} ${data.guests[key].surname}, ${data.guests[key].social_security_number}`;}));
          setDishSelect(Object.keys(data.dishes).map((key) => { return String(data.dishes[key].name)}));
          setDessertSelect(Object.keys(data.desserts).map((key) => {return String(data.desserts[key].name)}));

          setGuest(`${specificData.guest.name} ${specificData.guest.surname}, ${specificData.guest.social_security_number}`);
          setDish(`${specificData.dish.name}`);
          setDessert(`${specificData.dessert.name}`);

      }
      fetchMealOptionsdata();
    }, [])


    let navigate = useNavigate(); 
    const routeChange = () =>{ 
        let path = `/meals`; 
        navigate(path);
    }


    const {register, handleSubmit, formState: { errors }} = useForm();

    const getGuestIdBySocialNum = (socialNum) => {
      console.log(mealOptionsData);
      for (let i in mealOptionsData.guests){
        if (mealOptionsData.guests[i].social_security_number == socialNum){
            return mealOptionsData.guests[i].id;
        }
      }
    }

    const getDishIdByDishName = (dishName) => {
      for (let i in mealOptionsData.dishes){
        if (mealOptionsData.dishes[i].name == dishName){
            return mealOptionsData.dishes[i].id;
        }
      }
    }

    const getDessertIdByDessertName = (dessertName) => {
      for (let i in mealOptionsData.desserts){
        if (mealOptionsData.desserts[i].name == dessertName){
            return mealOptionsData.desserts[i].id;
        }
      }
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }



    const onSubmit = async (data) => {
        data["date"] = date.toISOString().split('T')[0];
        data["guest"] = getGuestIdBySocialNum(guest.split(" ")[2]);
        data["dish"] = getDishIdByDishName(dish);
        data["dessert"] = getDessertIdByDessertName(dessert);
        console.log(data);
        try{
            const response = await updateMeal(params.id, data);
            if (response) {
                setAlertSeverity("success");
                setShowAlert("Meal edited successfully!");
                routeChange();
                return;
            }
        } catch (error){
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

    const handleDateChange = (newDate) => {
        setDate(newDate);
    }


    return (
        <>
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Page" title="Edit meal" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                        
                    <Autocomplete
                        disablePortal
                        id="guestSelectBox"
                        value={guest}
                        style={{width: 400}}
                        onChange={(event, newValue) => {
                            setGuest(newValue);
                        }}
                        options={guestSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Guest" />}
                    />

                        
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date Picker"
                            inputFormat="MM-DD-YYYY"
                            value={date}
                            onChange={handleDateChange}
                            disablePast={true}
                            //shouldDisableDate={disableUnavailableDates}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>


                    <TextField 
                        id="outlined-basic" 
                        label="Time of day"
                        variant="outlined"
                        style={{width: 400}}
                        {...register("time_of_day", {required: "Time of day is required"})}
                        defaultValue={mealObject.time_of_day}
                        error={!!errors?.time_of_day}
                        helperText={errors?.time_of_day ? errors.time_of_day.message : null} 
                    />


                    <Autocomplete
                        disablePortal
                        id="dishSelectBox"
                        style={{width: 400}}
                        value={dish}
                        onChange={(event, newValue) => {
                            setDish(newValue);
                        }}
                        options={dishSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Dish" />}
                    />


                    <Autocomplete
                        disablePortal
                        id="dessertSelectBox"
                        style={{width: 400}}
                        value={dessert}
                        onChange={(event, newValue) => {
                            setDessert(newValue);
                        }}
                        options={dessertSelect}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Dessert" />}
                    />


                    <Button type="submit" variant="contained" >Edit meal</Button>
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

export default EditMeal;