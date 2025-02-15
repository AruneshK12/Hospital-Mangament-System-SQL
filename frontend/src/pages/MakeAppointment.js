import React, {useEffect, useState} from "react"
import {
    Autocomplete,
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
import {getAvailableAppointments, getAvailableAppointmentsHospital, performBookAppointment} from "../apis/PatientApis";

function MakeAppointment({patientId,openModal,openDialog,closeDialog}) {

    const [selectedHospital, setSelectedHospital] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [hospitals,setHospitals] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointmentDate, setAppointmentDate] = useState(null);
    const [availableAppointments, setAvailableAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const maxDate = moment().add(10, "days");
    const minDate = moment();

    const getAllHospitalsAPI = async () => {
        try {
            const response = await getAllHospitals();
            if (response?.responseObject?.hospitals?.length > 0) {
                let hospitalList = [];
                response?.responseObject?.hospitals.map((hospital) => {
                    hospitalList.push({
                        id: hospital?.HospitalId,
                        name: hospital?.HospitalName
                    });
                });
                setHospitals(hospitalList);
            }
        } catch (error) {
            console.log("error: ",error)
        }
    }

    const getALlDoctorsForHospital = async () => {
        const hospId = selectedHospital?.id;
        if (hospId !== null) {
            const response = await getHospitalDoctors(hospId);
            if (response?.responseObject?.length > 0) {
                let doctorsList = [{id: -1, name: 'All'}]
                response?.responseObject?.map((doctor) => {
                   doctorsList.push({
                        id: doctor?.DoctorId,
                       name: "Dr. " + doctor?.FirstName + " " + doctor?.LastName
                   });
                });
                setDoctors(doctorsList);
                setSelectedDoctor(null);
            }
        }
    }

    const getAvailabilityDoctors = async () => {
        try {
            let appointDate = appointmentDate.format("YYYY-MM-DD");
            const response = await getAvailableAppointments(selectedDoctor.id,appointDate);
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

    const getAllAvailableDoctorsForHospital = async () => {
        try {
            let appointDate = appointmentDate.format("YYYY-MM-DD");
            const response = await getAvailableAppointmentsHospital(selectedHospital.id, appointDate);
            if (response?.responseObject?.availableDoctors?.length > 0) {
                let appointList = [];
                response?.responseObject.availableDoctors.map((docList) => {
                    let tempId = 1;
                    docList?.availableAppointments.map((ap) => {
                        const date = ap.AppointmentDate;
                        const time = ap.AvailableTime;

                        const combinedDateTime = `${date.split('T')[0]}T${time}`;

                        appointList.push({
                            id: tempId,
                            doctorId: docList.DoctorId,
                            doctorName: docList.DoctorName,
                            AppointmentTime: moment(combinedDateTime).format('MMM Do YYYY h:mm a'),
                            price: "$" + docList.Price
                        });
                        tempId = tempId + 1;
                    });
                });
                setAvailableAppointments(appointList);
            }
        } catch (error) {
            console.log("error: ",error);
        }
    }
    useEffect(() => {
        if (selectedHospital != null) {
            getALlDoctorsForHospital();
        }
    }, [selectedHospital]);

    useEffect(() => {
        if (appointmentDate != null) {
            if (selectedDoctor.id === -1) {
                getAllAvailableDoctorsForHospital();
            } else {
                getAvailabilityDoctors();
            }
        }
    },[appointmentDate]);

    useEffect(() => {
        getAllHospitalsAPI();
    },[]);

    const makeAppointment = async () => {
        try {
            const chosenApp = availableAppointments[selectedAppointment - 1];
            const appointTS = moment(chosenApp.AppointmentTime,'MMM Do YYYY h:mm a')
                .format('YYYY-MM-DD HH:mm:ss');
            const response = await performBookAppointment(patientId, chosenApp.doctorId, appointTS);
            if (response?.responseObject !== null) {
                alert("AppointmentCreated with AppointmentId: " + response?.responseObject?.AppointmentId);
                setSelectedAppointment(null);
                setSelectedDoctor(null);
                setDoctors([]);
                setSelectedHospital(null);
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
                {"Make an appointment"}
                <IconButton
                    aria-label="close"
                    onClick={() => closeDialog()}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
                    <Autocomplete
                        options={hospitals}
                        getOptionLabel={(option) => option.name}
                        value={selectedHospital}
                        onChange={(event, newValue) => setSelectedHospital(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Hospital" variant="outlined"/>}
                        fullWidth
                    />
                    <Autocomplete
                        options={doctors}
                        getOptionLabel={(option) => option.name}
                        value={selectedDoctor}
                        onChange={(event, newValue) => setSelectedDoctor(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Doctor" variant="outlined"/>}
                        fullWidth
                        disabled={selectedHospital === null}
                    />
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
                            <TableCell>Hospital Name</TableCell>
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
                                <TableCell>{selectedHospital != null ? selectedHospital?.name : ""}</TableCell>
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
                <Button onClick={() => makeAppointment()} autoFocus>
                    Make Appointment
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default MakeAppointment;
/**
 * const AppointmentDialog = ({ open, onClose }) => {
 *
 *             <DialogTitle>
 *                 Make an Appointment
 *                 <IconButton
 *                     aria-label="close"
 *                     onClick={onClose}
 *                     style={{ position: 'absolute', right: 8, top: 8 }}
 *                 >
 *                     <CloseIcon />
 *                 </IconButton>
 *             </DialogTitle>
 *             <DialogContent>
*
<div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
    * <Autocomplete
    *                         options={hospitals}
    * getOptionLabel={(option) => option}
    * value={selectedHospital}
    * onChange={(event, newValue) => setSelectedHospital(newValue)}
    * renderInput={(params) => <TextField {...params} label="Select Hospital" variant="outlined"/>}
    * fullWidth
    * />
    * <Autocomplete
    *                         options={departments}
    * getOptionLabel={(option) => option}
    * value={selectedDepartment}
    * onChange={(event, newValue) => setSelectedDepartment(newValue)}
    * renderInput={(params) => <TextField {...params} label="Select Department" variant="outlined"/>}
    * fullWidth
    * />
    * <Autocomplete
    *                         options={doctors}
    * getOptionLabel={(option) => option}
    * value={selectedDoctor}
    * onChange={(event, newValue) => setSelectedDoctor(newValue)}
    * renderInput={(params) => <TextField {...params} label="Select Doctor" variant="outlined"/>}
    * fullWidth
    * />
    * </div>
*
* <Table>
    * <TableHead>
    * <TableRow>
    * <TableCell>Hospital</TableCell>
    * <TableCell>Department</TableCell>
    * <TableCell>Doctor</TableCell>
    * <TableCell>Availability</TableCell>
    * </TableRow>
    * </TableHead>
    * <TableBody>
    * {tableData.map((row) => (
    * <TableRow key={row.id}>
        * <TableCell>{row.hospital}</TableCell>
        * <TableCell>{row.department}</TableCell>
        * <TableCell>{row.doctor}</TableCell>
        * <TableCell>{row.availability}</TableCell>
        * </TableRow>
    *))}
    * </TableBody>
    * </Table>
*
</DialogContent>
*
<DialogActions>
    * <Button onClick={onClose}>Close</Button>
    * <Button onClick={() => alert('Appointment made')} variant="contained" color="primary">
    * Make Appointment
    * </Button>
    * </DialogActions>
*
</Dialog>
*     )
;
*
}
;
*
*
export default AppointmentDialog;
 */