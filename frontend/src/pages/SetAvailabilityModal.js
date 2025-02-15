import React, {useState} from "react";
import {
    Box,
    Button,
    Checkbox, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    MenuItem,
    TextField, Typography
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {setDoctorAvailability} from "../apis/DoctorApis";

function SetAvailabilityModal({open, onClose, doctorId}) {

    const [startDate,setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null);

    const maxDate = moment().add(10, "days"); // Maximum date is 10 days from today
    const minDate = moment(); // Minimum date is today


    const handleSaveAvailability = async () => {
        let startParam = startDate.format("YYYY-MM-DD");
        let endParam = endDate.format("YYYY-MM-DD");
        try {
            const response = await setDoctorAvailability(startParam, endParam, doctorId);
            alert("Successful in setting the availability");
            setStartDate(null);
            setEndDate(null);
            onClose();
        } catch (error) {
            alert("Error in uploading availability times");
        }

    }

    return (<LocalizationProvider dateAdapter={AdapterMoment}>
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Select Availability Range</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <Typography>
                        Time slots for each day: 9:00 AM, 10:00 AM, 11:00 AM, 12:00 PM, 2:00 PM, 3:00 PM, 4:00 PM and 5:00 PM
                    </Typography>
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    minDate={minDate}
                    maxDate={maxDate}
                    renderInput={(params) => (
                        <TextField {...params} fullWidth margin="normal" />
                    )}
                />
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    minDate={minDate}
                    maxDate={maxDate}
                    renderInput={(params) => (
                        <TextField {...params} fullWidth margin="normal" />
                    )}
                    disabled={!startDate} // Prevent selecting end date before start date
                />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSaveAvailability}
                    disabled={!startDate || !endDate} // Disable save button if dates are not selected
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    </LocalizationProvider>);
}

export default SetAvailabilityModal;