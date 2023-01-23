import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button, IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles';
import React from 'react'
import { MdNotListedLocation } from 'react-icons/md';


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
        backgroundColor: "#e8e8e8",
        color: "#e31809",
        '& .MuiSvgIcon-root': {
            fontSize: '8rem'
        }
    }
}))

const ConfirmDialog = (props) => {
    const {confirmDialog, setConfirmDialog} = props;
    const classes = useStyles();

    return (
        <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
            <DialogTitle textAlign="center">
                <IconButton disableRipple className={classes.titleIcon}>
                    <MdNotListedLocation size={70} color="#e31809" backgroundColor="#e8e8e8"/>
                </IconButton>
            </DialogTitle>

            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subtitle}
                </Typography>
            </DialogContent>

            <DialogActions className={classes.dialogAction}>
                <Button variant="contained" style={{backgroundColor: "#F7F7F7", color: "#000000"}}
                    onClick={() => setConfirmDialog({...confirmDialog, isOpen: false})}>No
                </Button>
                <Button variant="contained" style={{backgroundColor: "#e31809"}} 
                    onClick={confirmDialog.onConfirm}>Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog
