import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  guestCount: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: theme.spacing(2),
  },
  infoLabel1: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  infoLabel2: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  card: {
    borderRadius: '10px',
  },
  button: {
    padding: '10px 20px',
  },
}));

const StatsCard = ({ objects, title, subtitle, tableName }) => {
  const classes = useStyles();

  let navigate = useNavigate();
  const routeChange = () => {
    let path = "/" + tableName + "/";
    navigate(path);
  }

  return (
    <Card className={classes.card} sx={{ maxWidth: 1100, minWidth: 310 }}>
      <CardContent>
        <Typography className={classes.infoLabel1} align='left' style={{fontSize: 18}}>{title}</Typography>  
        <Typography className={classes.guestCount} align='left' style={{fontSize: 26, fontWeight: 'bold'}}>{objects.length}</Typography>
        <Typography className={classes.infoLabel2} align='left' style={{fontSize: 18}}>{subtitle}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" className={classes.button} style={{ backgroundColor: "#5fceed" }} onClick={routeChange}>See {tableName}</Button>
      </CardActions>
    </Card>
  );
}
export default StatsCard;
