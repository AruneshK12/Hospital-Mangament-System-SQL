import React, {useEffect, useState} from "react"
import {
    Autocomplete, Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl,
    IconButton, MenuItem, Radio, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField,
    Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {getAllHospitals} from "../apis/AdminApis";
import {getHospitalDoctors} from "../apis/DoctorApis";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import moment from "moment/moment";
import {
    getAvailableAppointments,
    getAvailableAppointmentsHospital,
    performBookAppointment,
    performModifyAppointment
} from "../apis/PatientApis";

function ModifyAppointment(
    {patientId,currAppointment,openModal,closeDialog}) {

    const [appointmentDate, setAppointmentDate] = useState(null);
    const [availableAppointments, setAvailableAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const maxDate = moment().add(10, "days");
    const minDate = moment();



    const getAvailabilityDoctors = async () => {
        try {
            let appointDate = appointmentDate.format("YYYY-MM-DD");
            const response = await getAvailableAppointments(currAppointment?.DoctorId,appointDate);
            if (response?.responseObject?.length > 0) {
                let appointList = [];
                let tempId = 1;
                response?.responseObject.map((ap) => {
                    const date = ap.AppointmentDate;
                    const time = ap.AvailableTime;

                    const combinedDateTime = `${date.split('T')[0]}T${time}`;
                    appointList.push({
                        id: tempId,
                        doctorId: ap.DoctorId,
                        doctorName: ap.DoctorName,
                        AppointmentTime: moment(combinedDateTime).format('MMM Do YYYY h:mm a'),
                        price: "$" + ap.Price
                    });
                    tempId = tempId + 1;
                });
                setAvailableAppointments(appointList);
            }
        } catch (error) {
            console.log("error: ",error);
        }
    }


    useEffect(() => {
        if (appointmentDate != null) {
                getAvailabilityDoctors();
        }
    },[appointmentDate]);

    const performModifyPatientAppointment = async () => {
        try {
            const chosenApp = availableAppointments[selectedAppointment - 1];
            const appointTS = moment(chosenApp.AppointmentTime,'MMM Do YYYY h:mm a')
                .format('YYYY-MM-DDTHH:mm:ss');
            const response = await performModifyAppointment(
                chosenApp.doctorId, currAppointment?.AppointmentId, patientId, appointTS);
            if (response?.responseObject !== null) {
                alert("Appointment Modified with AppointmentId: " + response?.responseObject?.AppointmentId);
                setSelectedAppointment(null);
                closeDialog();
            }
        } catch (error) {
            console.log("error: ",error)
        }
    }
    return (
        <Dialog
            open={openModal}
            onClose={() => closeDialog()}
            fullWidth={true}
            maxWidth="lg"
            PaperProps={{
                style: {
                    height: '80vh', // 3/4th of the screen height
                },
            }}
        >
            <DialogTitle id="alert-dialog-title">
                {"Modify an appointment"}
                <IconButton
                    aria-label="close"
                    onClick={() => closeDialog()}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="left"
                    justifyContent="center"
                >
                    <Typography variant={"h5"}>
                        Current Appointment Detail:
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Doctor Name</TableCell>
                                <TableCell>Appointment Date</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={currAppointment?.AppointmentId}>
                                <TableCell>{currAppointment?.DoctorName}</TableCell>
                                <TableCell>{currAppointment?.AppointmentDate}</TableCell>
                                <TableCell>{currAppointment?.ConsultationPrice}</TableCell>
                                <TableCell>{currAppointment?.AppointmentStatus}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
                <div style={{display: 'flex', gap: '16px', marginTop: '24px', alignItems: "center"}}>
                    <Typography variant={"h6"}>
                        Select New Appointment Date:
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            label="Start Date"
                            value={appointmentDate}
                            onChange={(date) => setAppointmentDate(date)}
                            minDate={minDate}
                            maxDate={maxDate}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth margin="normal" />
                            )}
                            style={{width: "100%"}}
                        />
                    </LocalizationProvider>
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Select</TableCell>
                            <TableCell>Doctor Name</TableCell>
                            <TableCell>Appointment Date</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {availableAppointments.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <Radio
                                        checked={row.id === selectedAppointment}
                                        onChange={() => setSelectedAppointment(row.id)}
                                        value={row.id}
                                    />
                                </TableCell>
                                <TableCell>{row?.doctorName}</TableCell>
                                <TableCell>{row?.AppointmentTime}</TableCell>
                                <TableCell>{row?.price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => closeDialog()}>Close</Button>
                <Button onClick={() => performModifyPatientAppointment()} autoFocus>
                    Modify Appointment
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModifyAppointment;
