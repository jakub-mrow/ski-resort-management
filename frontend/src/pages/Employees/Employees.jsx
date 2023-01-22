import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getEmployees, deleteEmployee } from '../../api/employeeRequests';

import { Button, Alert, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';
import { ConfirmDialog } from '../../components';

const Employees = () => {

    const [employees, setEmployees] = useState([]);
    const { employeeObject, setEmployeeObject } = useStateContext();

    const [showAlert, setShowAlert] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("error");

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subtitle: "" })


    const sendEmployeeData = (data) => {
        setEmployeeObject(data)
    }

    const fetchEmployees = async () => {
        const employees = await getEmployees();
        setEmployees(employees);
    }

    useEffect(() => {
        fetchEmployees();
    }, [])

    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/employees/create`;
        navigate(path);
    }

    const navigateEditRoute = (id) => {
        let path = `/employees/${id}/edit`;
        navigate(path)
    }

    const handleDelete = (id) => {
        try {
            setConfirmDialog({
                isOpen: true,
                title: "Are you sure you want to delete this record?",
                subtitle: "It may affect other relations",
                onConfirm: () => { deleteEmployeeAction(id) }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const deleteEmployeeAction = (id) => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        deleteEmployee(id);
        setEmployees(employees.filter((item) => item.id !== id))
        setAlertSeverity("success");
        setShowAlert("Employee deleted successfully");
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
                                sendEmployeeData(params.row);
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
            field: "social_security_number",
            headerName: "Social security number",
            width: 200
        },
        {
            field: "name",
            headerName: "Name",
            width: 200
        },
        {
            field: "surname",
            headerName: "Surname",
            width: 200
        },
        {
            field: "job",
            headerName: "Job",
            width: 300
        },
        {
            field: "salary",
            headerName: "Salary",
            width: 300
        }
    ]

    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
                <Header category="Page" title="Employees" />

                <div className="flex flex-wrap lg:flex-nowrap justify-center">
                    <Box sx={{ height: 650, width: '100%' }}>
                        <DataGrid
                            rows={employees}
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
                    <Button variant="contained" onClick={routeChange}>Add new employee</Button>
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
export default Employees;
