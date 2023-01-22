import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getDishes, deleteDish } from '../../api/dishRequests';

import { Button, Alert, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';
import { ConfirmDialog } from '../../components';

const Dishes = () => {

    const [dishes, setDishes] = useState([]);
    const { dishObject, setDishObject } = useStateContext();

    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subtitle: "" })


    const sendDishData = (data) => {
        setDishObject(data)
    }

    const fetchDishes = async () => {
        const dishes = await getDishes();
        setDishes(dishes);
    }

    useEffect(() => {
        fetchDishes();
    }, [])

    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/dishes/create`;
        navigate(path);
    }

    const navigateEditRoute = (id) => {
        let path = `/dishes/${id}/edit`;
        navigate(path)
    }

    const handleDelete = (id) => {
        try {
            setConfirmDialog({
                isOpen: true,
                title: "Are you sure you want to delete this record?",
                subtitle: "It may affect other relations",
                onConfirm: () => { deleteDishAction(id) }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const deleteDishAction = (id) => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        deleteDish(id);
        setDishes(dishes.filter((item) => item.id !== id))
        setAlertSeverity("success");
        setShowAlert("Dish deleted successfully");
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
                                sendDishData(params.row);
                                navigateEditRoute(params.row.id)
                            }}>Edit</Button>
                        <Button variant="contained"
                            style={{
                                backgroundColor: "#e31809",
                            }}
                            onClick={() => handleDelete(params.row.id)}>Delete</Button>
                    </div>
                )
            }
        }
    ]

    const columns = [
        {
            field: "name",
            headerName: "Name",
            width: 200
        },
        {
            field: "description",
            headerName: "Description",
            width: 550
        },
        {
            field: "calories",
            headerName: "Calories",
            width: 150
        },
        {
            field: "cost",
            headerName: "Preparation cost",
            width: 150
        },
        {
            field: "price",
            headerName: "Menu price",
            width: 150
        }
    ]

    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
                <Header category="Page" title="Dishes" />

                <div className="flex flex-wrap lg:flex-nowrap justify-center">
                    <Box sx={{ height: 650, width: '100%' }}>
                        <DataGrid
                            rows={dishes}
                            columns={columns.concat(actionColumn)}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            disableSelectionOnClick
                            experimentalFeatures={{ newEditingApi: true }}
                        />
                    </Box>
                </div>

                <div class="flex flex-col space-y-4 mx-auto justify-center items-center">
                    <Button variant="contained" onClick={routeChange}>Add new dish</Button>
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
};
export default Dishes;