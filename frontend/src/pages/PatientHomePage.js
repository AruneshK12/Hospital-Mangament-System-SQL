import React, {useState, useEffect} from "react";
import {
    Box,
    Button,
    Checkbox, Collapse, Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid2, IconButton, MenuItem, Paper, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField,
    Typography
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import MakeAppointment from "./MakeAppointment";
import EditPatientDialog from "./EditPatientDialog";
import {useNavigate, useParams} from "react-router-dom";
import {
    cancelAppointment,
    editPatientDetail,
    getPatientAppointments,
    getPatientDetail,
    getPatientMetricDetail
} from "../apis/PatientApis";
import moment from "moment";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import ModifyAppointment from "./ModifyAppointment";

function PatientHomePage() {
    const {patientId} = useParams();
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState({
        Address: "",
        DateOfBirth: "",
        Email: "m",
        FirstName: "Test",
        Gender: "M",
        LastName: "Warren",
        Password: "",
        PatientId: -1,
        Phone: "",
        xCoordinates: -97.9818,
        yCoordinates: 38.339
    });

    const getPatientData = async (patientId) => {
        try {
            const patientResp = await getPatientDetail(patientId);
            if (patientResp?.responseObject) {
                setPatientData(patientResp?.responseObject);
            }
        } catch (error) {
            console.log("error: ",error);
        }

    }
    useEffect( () => {
       if (patientId) {
           getPatientData(patientId);
           getPatientMetric(patientId);
           getPatientAppointmentDetail(patientId);
       }
    },[patientId]);
    const [openModal,setOpenModal] = useState(false);
    const openDialog = () => setOpenModal(true);
    const closeDialog = () => {
        getPatientAppointmentDetail(patientId);
        setOpenModal(false);
    }
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSavePatient = async (updatedData) => {
        console.log("Updated Patient Data:", updatedData);
        const response = await editPatientDetail(updatedData);
        if (response?.success === true) {
            alert("Patient detail updated!");
        }
        setPatientData(updatedData);
    };
    const [patientMetric,setPatientMetric] = useState([
        { label: "Total Appointments", value: 0 },
        { label: "Upcoming Appointments", value: 0 },
        { label: "Lab Reports Pending", value: 0 },
    ]);

    const getPatientMetric = async (patientId) => {
        try {
            const response = await getPatientMetricDetail(patientId);
            if (response?.responseObject) {
                let tempResp = response?.responseObject[0];
                let tempMetrics = [];
                tempMetrics.push({label: "Total Appointments", value: tempResp?.TotalAppointments});
                tempMetrics.push({label: "Upcoming Appointments", value: tempResp?.AppointmentsLeft});
                tempMetrics.push({label: "Lab Reports Pending", value: tempResp?.LabReportsPending});
                setPatientMetric(tempMetrics);
            }
        } catch (error) {
            console.log("error: ", error)
        }
    }

    const [appointmentList,setAppointmentList] = useState([]);
    const getPatientAppointmentDetail = async () => {
        try {
            const response = await getPatientAppointments(patientId);
            if (response?.responseObject?.length > 0) {
                let tempList = []
                response?.responseObject.map((ap) => {
                    const date = ap.AppointmentDate;
                    const time = ap.AppointmentTime;

                    const combinedDateTime = `${date.split('T')[0]}T${time}`;
                    tempList.push({
                        AppointmentId: ap.AppointmentId,
                        AppointmentStatus: ap.AppointmentStatus,
                        DoctorName: ap.DoctorName,
                        DoctorId: ap.DoctorId,
                        AppointmentDate: moment(combinedDateTime).format('MMM Do YYYY h:mm a'),
                        ConsultationPrice: ap.ConsultationPrice,
                    });
                })
                setAppointmentList(tempList);
            }
        } catch (error) {
            console.log("error: ",error)
        }
    }

    const patientButtons = [
        {
            label: "Edit user details",
            icon: <PersonIcon />,
            onClick: () => {
                setIsDialogOpen(true);
            },
        },
        {
            label: "Book an appointment",
            icon: <AddCircleOutlineIcon />,
            onClick: () => {
                openDialog();
            },
        },
        {
            label: "View Transactions",
            icon: <CalendarTodayIcon />,
            onClick: () => {
                navigate('/patient-transactions/' + patientId)
            },
        }
    ];

    const [openRowId, setOpenRowId] = useState(null);

    const handleRowClick = (rowId) => {
        setOpenRowId((prevId) => (prevId === rowId ? null : rowId));
    };

    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const cancelPatientAppointment = async (appId) => {
        try {
            const response = await cancelAppointment(appId);
            alert("Appointment Id: " + appId + " cancelled successfully!");
            getPatientAppointmentDetail();
        } catch (error) {
            console.log("Error: ", error);
            alert("Error in Cancelling Appointment");
        }
    }

    const [modifyModal,setModifyModal] = useState(false);
    const openModifyModal = () => setModifyModal(true);
    const closeModifyModal = () => {
        getPatientAppointmentDetail(patientId);
        setModifyModal(false);
    }

    const openModifyWindow = (appId) => {
        const selectedAppoint = appointmentList.find((row) => row.AppointmentId === appId);
        setSelectedAppointment(selectedAppoint);
        console.log("selected App: ",selectedAppoint);
        openModifyModal();
    }
    return (
        <div style={{marginLeft: "3rem", marginRight: "3rem"}}>
            {/* Align welcome message at the start */}
            <Box
                display="block"
                textAlign="left"
                mb={2} // Add margin-bottom to separate sections
            >
                <Typography variant="h4" style={{ marginTop: "3rem", marginBottom: "1rem" }}>
                    Welcome to your dashboard <b>{patientData?.FirstName + " " + patientData?.LastName}</b>
                </Typography>
                <Box sx={{ padding: 2 }}>
                    <Grid2 container spacing={2}>
                        {patientMetric.map((metric, index) => (
                            <Grid2 item xs={12} sm={4} key={index}>
                                <Box
                                    sx={{
                                        padding: 3,
                                        textAlign: "center",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        sx={{ fontWeight: "bold", color: "#3f51b5" }}
                                    >
                                        {metric.value}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {metric.label}
                                    </Typography>
                                </Box>
                            </Grid2>
                        ))}
                    </Grid2>
                </Box>
            </Box>
            {/* Center align the rest of the content */}
            <Box
                display="flex"
                flexDirection="column"
                alignItems="left"
                justifyContent="center"
                height="400"
            >
                <Typography variant="h4" style={{ marginBottom: "1rem" }}>
                    Perform Operations
                </Typography>
                <Grid2 container spacing={2} sx={{ padding: 2 }}>
                    {patientButtons.map((button, index) => (
                        <Grid2 item xs={12} sm={6} md={3} key={index}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={button.icon}
                                onClick={button.onClick}
                                sx={{
                                    textTransform: "none", // Keeps the button text from being all uppercase
                                    fontWeight: "bold",
                                    padding: 2,
                                }}
                            >
                                <Typography variant="button">{button.label}</Typography>
                            </Button>
                        </Grid2>
                    ))}
                </Grid2>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="left"
                justifyContent="center"
                marginTop="2rem"
            >
                <Typography variant="h4" style={{ marginBottom: "1rem" }}>
                    Current Appointments
                </Typography>
                <Grid2 container spacing={2} sx={{ padding: 2 }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Appointment Id</TableCell>
                                    <TableCell>Appointment Status</TableCell>
                                    <TableCell>Doctor Name</TableCell>
                                    <TableCell>Appointment Date</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointmentList.map((row)=> (
                                    <React.Fragment key={row.AppointmentId}>
                                    <TableRow>
                                        <TableCell>
                                            {row.AppointmentStatus === 'Scheduled' && (
                                                <IconButton
                                                size="small"
                                                onClick={() => handleRowClick(row.AppointmentId)}>
                                                {openRowId === row.AppointmentId ? (
                                                    <KeyboardArrowUp />
                                                ) : (
                                                    <KeyboardArrowDown />
                                                )}
                                            </IconButton>)}

                                        </TableCell>
                                        <TableCell>{row.AppointmentId}</TableCell>
                                        <TableCell>{row.AppointmentStatus}</TableCell>
                                        <TableCell>{row.DoctorName}</TableCell>
                                        <TableCell>{row.AppointmentDate}</TableCell>
                                        <TableCell>{"$" + row.ConsultationPrice}</TableCell>
                                    </TableRow>
                                        {row.AppointmentStatus === 'Scheduled' && (<TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={openRowId === row.AppointmentId} timeout="auto" unmountOnExit>
                                                    <Box
                                                        sx={{
                                                            position: "sticky",
                                                            bottom: 0,
                                                            backgroundColor: "white",
                                                            padding: 2,
                                                            display: "flex",
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <Button variant="contained" color="primary" onClick={() => openModifyWindow(row.AppointmentId)}>
                                                            Modify Appointment
                                                        </Button>
                                                        <Button variant="contained" color="secondary" onClick={() => cancelPatientAppointment(row.AppointmentId)}>
                                                            Cancel Appointment
                                                        </Button>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>)}
                                </React.Fragment>)
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid2>
            </Box>

            <MakeAppointment openModal={openModal} patientId={patientId} closeDialog={closeDialog} openDialog={openDialog}/>
            <EditPatientDialog open={isDialogOpen}
                               onClose={() => setIsDialogOpen(false)}
                               initialPatientData={patientData}
                               onSave={handleSavePatient}/>
            <ModifyAppointment currAppointment={selectedAppointment}
                               openModal={modifyModal}
                               patientId={patientId}
                               closeDialog={closeModifyModal}/>
        </div>);
}

export default PatientHomePage;