import React, { useEffect } from "react";
import { useState } from 'react';
//import { makeStyles } from "@material-ui/core/styles";
import { makeStyles } from '@mui/styles';
import { FaChartLine } from 'react-icons/fa';
import StatsCard from "./StatsCard"
import SeasonCard from "./SeasonCard"
import Header from "./Header";
import Button from '@mui/material/Button';

import { getGuests } from '../api/guestRequests';
import { getEmployees } from '../api/employeeRequests';
import { getReservations } from '../api/reservationRequests';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down("md")]: {
            flexDirection: "column",
        },
    },
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gridAutoFlow: 'column',
        gridGap: theme.spacing(2),
        width: '100%',
    },
    verticalContainer: {
        display: 'grid',
        gridTemplateRows: 'repeat(2, 1fr)',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%'
    },
}));


const Statistics = () => {
    const classes = useStyles();

    const [guests, setGuests] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [reservations, setReservations] = useState([]);


    const fetchGuests = async () => {
        const guests = await getGuests();
        setGuests(guests);
    }

    const fetchEmployees = async () => {
        const employees = await getEmployees();
        setEmployees(employees);
    }

    const fetchReservations = async () => {
        const reservations = await getReservations();
        setReservations(reservations);
    }

    useEffect(() => {
        fetchGuests();
        fetchEmployees();
        fetchReservations();
    }, [])

    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <Header category="Ski Resort" title="Information" />
                <div className={classes.verticalContainer}>
                    <div className={classes.container}>
                        <StatsCard objects={guests} title="There are currently..." subtitle="...guests in our hotel." tableName="guests" />
                        <StatsCard objects={reservations} title="They made..." subtitle="...reservations." tableName="reservations" />
                        <StatsCard objects={employees} title="And they are served by..." subtitle="...employees." tableName="employees" />
                    </div>
                    <div className={classes.container}>
                        <SeasonCard
                            title="Start of season"
                            textToDisplay="Increase the prices of rooms, dishes and dessert by the percent of your choice."
                            procedureName="increase_prices"
                            procedureNameNice="Increase prices"
                            action="increase"
                            icon={<FaChartLine />}
                        />
                        <SeasonCard
                            title="End of season"
                            textToDisplay="Decrease the prices of rooms, dishes and dessert by the percent of your choice."
                            procedureName="decrease_prices"
                            procedureNameNice="Decrease prices"
                            action="decrease"
                            icon={<FaChartLine />}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
export default Statistics;



