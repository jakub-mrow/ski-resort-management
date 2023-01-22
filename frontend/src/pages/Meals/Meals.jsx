import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getMeals, deleteMeal } from '../../api/mealRequests';

import { Button, Alert, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';
import { ConfirmDialog } from '../../components';

const Meals = () => {
    const [meals, setMeals] = useState([]);
    const { mealObject, setMealObject } = useStateContext();

    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subtitle: "" })


    const fetchMeals = async () => {
        const meals = await getMeals();
        console.log(meals)
        setMeals(meals);
    }

    useEffect(() => {
        fetchMeals();
    }, [])

    const sendMealData = (data) => {
        setMealObject(data);
    }

    let navigate = useNavigate();
    const navigateEditRoute = (id) => {
        let path = `/meals/${id}/edit`;
        navigate(path);
    }

    const navigateCreateRoute = () => {
        let path = `/meals/create`;
        navigate(path);
    }

    const handleDeleteMeal = (id) => {
        try {
            setConfirmDialog({
                isOpen: true,
                title: "Are you sure you want to delete this record?",
                subtitle: "",
                onConfirm: () => { deleteMealAction(id) }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const deleteMealAction = (id) => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        deleteMeal(id);
        setMeals(meals.filter((item) => item.id !== id));
        setAlertSeverity("success");
        setShowAlert("Meal deleted successfully");
    }

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="p-2 space-x-4">
                        <Button variant="contained"
                            style={{
                                backgroundColor: "#21b6ae",
                            }}
                            onClick={() => {
                                sendMealData(params.row);
                                navigateEditRoute(params.row.id)
                            }}>
                            Edit
                        </Button>
                        <Button variant="contained"
                            style={{
                                backgroundColor: "#e31809",
                            }}
                            onClick={() => handleDeleteMeal(params.row.id)}>Delete
                        </Button>
                    </div>
                )
            }
        }
    ]
    const columns = [
        {
            field: "id",
            headerName: "Id",
            width: 100
        },
        {
            field: "guest",
            headerName: "Guest",
            width: 200
        },
        {
            field: "date",
            headerName: "Date",
            width: 150
        },
        {
            field: "time_of_day",
            headerName: "Time of day",
            width: 150
        },
        {
            field: "dish",
            headerName: "Dish",
            width: 300
        },
        {
            field: "dessert",
            headerName: "Dessert",
            width: 300
        },
    ]


    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
                <Header category="Page" title="Meals" />

                <div className="flex flex-wrap lg:flex-nowrap justify-center">
                    <Box sx={{ height: 650, width: '100%' }}>
                        <DataGrid
                            rows={meals}
                            columns={columns.concat(actionColumn)}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            disableSelectionOnClick
                            experimentalFeatures={{ newEditingApi: true }}
                        />
                    </Box>
                </div>

                <div className="flex flex-col space-y-4 mx-auto justify-center items-center">
                    <Button variant="contained" onClick={navigateCreateRoute}>Add new meal</Button>
                </div>
            </div>
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={showAlert !== null} autoHideDuration={3000} onClose={() => setShowAlert(null)}>
                <Alert severity={alertSeverity}>{showAlert}</Alert>
            </Snackbar>
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    )
}

export default Meals;