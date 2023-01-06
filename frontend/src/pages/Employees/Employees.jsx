import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Header } from '../../components';

import { getEmployees, deleteEmployee } from '../../api/employeeRequests';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStateContext } from '../../context/ContextProvider';

const Employees = () => {

    const [employees, setEmployees] = useState([]);
    const { employeeObject, setEmployeeObject } = useStateContext();

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
    const routeChange = () =>{ 
        let path = `/employees/create`; 
        navigate(path);
    }

    const navigateEditRoute = (id) => {
        let path = `/employees/${id}/edit`;
        navigate(path)
    }

    const handleDelete = (id) => {
        try {
            deleteEmployee(id);
            setEmployees(employees.filter((item) => item.id !== id))
        } catch (error) {
            console.log(error)
        }
    }

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="p-2 space-x-4">
                        <Button variant="contained" onClick={() => {
                            sendEmployeeData(params.row);
                            navigateEditRoute(params.row.id)}}>Edit</Button>
                        <Button variant="contained" onClick={() => handleDelete(params.row.id)}>Delete</Button>
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
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl space-y-4">
        <Header category="Page" title="Employees" />

        <div className="flex flex-wrap lg:flex-nowrap justify-center">
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={employees}
                    columns={columns.concat(actionColumn)}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
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
    )
};
export default Employees;
