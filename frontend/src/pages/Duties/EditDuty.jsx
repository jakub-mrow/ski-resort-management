import React, { useEffect, useState } from 'react'

import { Header } from '../../components';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { updateDuty, getDutyCreateData } from '../../api/dutyRequests';

import { Button, Alert, Snackbar, Autocomplete } from '@mui/material';

import TextField from '@mui/material/TextField';
import { useStateContext } from '../../context/ContextProvider';


const EditDuty = () => {
  const [showAlert, setShowAlert] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [dutyOptionsData, setDutyOptionsData] = useState({});

  const { dutyObject, setDutyObject } = useStateContext();

  const [employeeSelect, setEmployeeSelect] = useState([]);
  const [taskSelect, setTaskSelect] = useState([]);
  const [localizationSelect, setLocalizationSelect] = useState([]);

  const [employee, setEmployee] = useState("");
  const [task, setTask] = useState("");
  const [localization, setLocalization] = useState("");


  const params = useParams();

  useEffect(() => {
    const fetchDutyOptionsdata = async () => {
        const data = await getDutyCreateData();
        setDutyOptionsData(data);
        setEmployeeSelect(Object.keys(data.employees).map((key) => { return `${data.employees[key].name} ${data.employees[key].surname}, ${data.employees[key].social_security_number}`;}));
        setTaskSelect(Object.keys(data.tasks).map((key) => { return String(data.tasks[key].name)}));
        setLocalizationSelect(Object.keys(data.localizations).map((key) => {return String(data.localizations[key].name)}));
    }
    fetchDutyOptionsdata();
  }, [])


  let navigate = useNavigate(); 
  const routeChange = () =>{ 
      let path = `/duties`; 
      navigate(path);
  }


  const {register, handleSubmit, formState: { errors }} = useForm();

  const getEmployeeIdBySocialNum = (socialNum) => {
    console.log(dutyOptionsData);
    for (let i in dutyOptionsData.employees){
        if (dutyOptionsData.employees[i].social_security_number == socialNum){
            return dutyOptionsData.employees[i].id;
        }
    }
  }

  const getTaskIdByTaskName = (taskName) => {
      for (let i in dutyOptionsData.tasks){
          if (dutyOptionsData.tasks[i].name == taskName){
              return dutyOptionsData.tasks[i].id;
          }
      }
  }

  const getLocalizationIdByLocalizationName = (localizationName) => {
      for (let i in dutyOptionsData.localizations){
          if (dutyOptionsData.localizations[i].name == localizationName){
              return dutyOptionsData.localizations[i].id;
          }
      }
  }

  const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }



  const onSubmit = async (data) => {
    data["employee"] = getEmployeeIdBySocialNum(employee.split(" ")[2]);
    data["task"] = getTaskIdByTaskName(task);
    data["localization"] = getLocalizationIdByLocalizationName(localization);
    console.log(data);
    try{
      const response = await updateDuty(params.id, data);
      if (response) {
        setAlertSeverity("success");
        setShowAlert("Duty edited successfully!");
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


  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header category="Page" title="Edit duty" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                  
            <Autocomplete
              disablePortal
              id="employeeSelectBox"
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
              id="taskSelectBox"
              style={{width: 400}}
              onChange={(event, newValue) => {
                  setTask(newValue);
              }}
              options={taskSelect}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Task" />}
            />


            <Autocomplete
              disablePortal
              id="localizationSelectBox"
              style={{width: 400}}
              onChange={(event, newValue) => {
                  setLocalization(newValue);
              }}
              options={localizationSelect}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Localization" />}
            />



            <Button type="submit" variant="contained" >Edit duty</Button>
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

export default EditDuty;