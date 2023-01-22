import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button, IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles';
import React from 'react'
import { MdNotListedLocation } from 'react-icons/md';
import { FaCalendarAlt } from 'react-icons/fa';

const useStyles = makeStyles(theme => ({
    dialog: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5)
    },
    dialogContent: {
        textAlign: "center"
    },
    dialogTitle: {
        textAlign: "center"
    },
    dialogAction: {
        justifyContent: "center"
    },
    titleIcon: {
        //backgroundColor: "#e8e8e8",
        color: "#e31809",
        '& .MuiSvgIcon-root': {
            fontSize: '8rem'
        }
    }
}))

const ReservationCostModal = (props) => {
    const {confirmDialog, setConfirmDialog} = props;
    const classes = useStyles();

    return (
        <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
            <DialogTitle textAlign="center">
                <IconButton disableRipple className={classes.titleIcon}>
                    <FaCalendarAlt size={100}/>
                </IconButton>
            </DialogTitle>

            <DialogContent className={classes.dialogContent}>
                <Typography variant="h5">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle1">
                    {confirmDialog.subtitle}
                </Typography>
            </DialogContent>

            <Button variant="contained" style={{backgroundColor: "#F7F7F7", color: "#000000"}}
                onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})}>Back
            </Button>
        </Dialog>
    )
}

export default ReservationCostModal