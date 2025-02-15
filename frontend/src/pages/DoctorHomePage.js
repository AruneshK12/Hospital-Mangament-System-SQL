import React, {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Collapse,
    Box,
    Button,
    Grid2,
    Typography
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {DataGrid} from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import MakeAppointment from "./MakeAppointment";
import EditPatientDialog from "./EditPatientDialog";
import DiagnosisReportModal from "./DiagnosisReportModal";
import {useNavigate, useParams} from "react-router-dom";
import EditDoctorDialog from "./EditDoctorDialog";
import {getPatientDetail} from "../apis/PatientApis";
import {
    cancelAppointment,
    editDoctorDetail,
    getDoctorAppointments,
    getDoctorDashboard,
    getDoctorDetail
} from "../apis/DoctorApis";
import SetAvailabilityModal from "./SetAvailabilityModal";
import moment from "moment";

function DoctorHomePage() {
    const {doctorId} = useParams();
    const navigate = useNavigate();
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [doctorData, setDoctorData] = useState({
        "DoctorId": 0,
        "FirstName": "Adam",
        "LastName": "Warren",
        "Gender": "M",
        "Rating": 5,
        "Price": 0,
        "Phone": "+456-510-317-9455",
        "Email": "user@example.com",
        "HospitalId": 0,
        "Password": "string"
    });

    const getDoctorData = async (doctorId) => {
        try {
            const doctorResp = await getDoctorDetail(doctorId);
            if (doctorResp?.responseObject) {
                setDoctorData(doctorResp?.responseObject);
            }
        } catch (error) {
            console.log("error: ",error);
        }

    }
    useEffect( () => {
        if (doctorId != null) {
            getDoctorData(doctorId);
            getDoctorAppointmentsList();
            getDoctorDashboardMetrics();
        }
    },[doctorId]);

    const [openRowId, setOpenRowId] = useState(null);

    const handleRowClick = (rowId) => {
        setOpenRowId((prevId) => (prevId === rowId ? null : rowId));
    };

    const [openModal,setOpenModal] = useState(false);
    const openDialog = () => setOpenModal(true);
    const closeDialog = () => setOpenModal(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const getDoctorDashboardMetrics = async () => {
        try {
            const response = await getDoctorDashboard(doctorId);
            if (response?.responseObject !== null) {
                let resp = response?.responseObject
                setDoctorMetrics([
                    { label: "Appointments Left Today", value: resp?.AppointmentsPendingToday },
                    { label: "Appointments Completed Today", value: resp?.AppointmentsCompletedToday},
                    { label: "Pending Lab Reports", value: resp?.PendingLabReports}
                ]);
            }
        } catch (error) {
            console.log("error: ",error);
        }
    }
    const [doctorMetrics,setDoctorMetrics] = useState([
        { label: "Appointments Left Today", value: 0 },
        { label: "Appointments Completed Today", value: 0},
        { label: "Pending Lab Reports", value: 0}
    ]);
    const doctorButtons = [
        {
            label: "Edit Doctor details",
            icon: <PersonIcon />,
            onClick: () => {
                setIsEditDialogOpen(true);
            },
        },
        {
            label: "View Lab Reports",
            icon: <AddCircleOutlineIcon />,
            onClick: () => {
                navigate('/doctor-lab-reports/' + doctorId)
            },
        },
        {
            label: "Set Availability",
            icon: <CalendarTodayIcon />,
            onClick: () => {
                setIsAvailDialogOpen(true);
            },
        }
    ];

    const [openDiagnosisModal, setOpenDiagnosisModal] = useState(false);
    const appointmentColDetails = ["Serial no.", "Appointment Id", "Patient Name", "Appointment Time", "Appointment Status"];
    const [appointmentRowData, setAppointmentRowData] = useState([]);

    const getDoctorAppointmentsList = async () => {
        try {
            const response = await getDoctorAppointments(doctorId);
            if (response?.responseObject?.length > 0) {
                let appointsList = []
                let serialNo = 1;
                response?.responseObject.map((ap) => {
                    const date = ap.AppointmentDate;
                    const time = ap.AppointmentTime;

                    const combinedDateTime = `${date.split('T')[0]}T${time}`;
                    appointsList.push({
                        id: serialNo,
                        AppointmentId: ap.AppointmentId,
                        patientName: ap.PatientName,
                        patientId: ap.PatientId,
                        patientEmail: ap.PatientEmail,
                        patientPhone: ap.PatientPhone,
                        AppointmentDate: ap.AppointmentDate,
                        AvailableTime: ap.AppointmentTime,
                        AppointmentTime: moment(combinedDateTime).format('MMM Do YYYY h:mm a'),
                        price: "$" + ap.ConsultationPrice,
                        status: ap.AppointmentStatus
                    })
                    serialNo = serialNo + 1;
                });
                setAppointmentRowData(appointsList);
            }

        } catch (error) {
            console.log("error: ",error);
        }
    }
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleSaveDoctor = async (updatedData) => {
        console.log("Updated Doctor Data:", updatedData);
        const response = await editDoctorDetail(updatedData);
        if (response?.success === true) {
            alert("Doctor detail updated!");
        }
        setDoctorData(updatedData);
    };

    const [isAvailDialogOpen, setIsAvailDialogOpen] = useState(false);
    const onDiagnosisClick = (rowId) => {
        const appointment = appointmentRowData[rowId-1];
        setSelectedAppointment(appointment);
        setOpenDiagnosisModal(true);
    }

    const cancelDocAppointment = async (rowId) => {
        try {
            const appData = appointmentRowData[rowId-1];
            if (appData?.AppointmentId !== null) {
                let appId = appData?.AppointmentId;
                const response = await cancelAppointment(appId);
                alert("Appointment Id: " + appId + " Cancelled!");
                window.location.reload();
            }
        } catch (error) {
            console.log("error: ",error)
        }
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
                    Welcome to your dashboard <b>{"Dr. " + doctorData?.FirstName +" " + doctorData?.LastName}</b>
                </Typography>
                <Box sx={{ padding: 2 }}>
                    <Grid2 container spacing={2}>
                        {doctorMetrics.map((metric, index) => (
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
                    {doctorButtons.map((button, index) => (
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
                    <TableContainer
                        component={Paper}
                        sx={{
                            height: 400, // Set a fixed height in pixels
                            overflowY: "auto", // Enable vertical scrolling
                            overflowX: "hidden", // Optional: Disable horizontal scrolling
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    {appointmentColDetails.map((col) => <TableCell>{col}</TableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointmentRowData.map((row) => (
                                    <React.Fragment key={row.id}>
                                        <TableRow>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRowClick(row.id)}
                                                >
                                                    {openRowId === row.id ? (
                                                        <KeyboardArrowUp />
                                                    ) : (
                                                        <KeyboardArrowDown />
                                                    )}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.AppointmentId}</TableCell>
                                            <TableCell>{row.AppointmentTime}</TableCell>
                                            <TableCell>{row.price}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={openRowId === row.id} timeout="auto" unmountOnExit>
                                                    <Box margin={2}>
                                                        <Typography variant="subtitle1" gutterBottom>
                                                            Contact Details
                                                        </Typography>
                                                        <Typography>
                                                            <strong>Phone:</strong> {row.patientPhone}
                                                        </Typography>
                                                        <Typography>
                                                            <strong>Email:</strong> {row.patientEmail}
                                                        </Typography>
                                                    </Box>
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
                                                        <Button variant="contained" color="primary" onClick={() => onDiagnosisClick(row.id)}>
                                                            Perform Diagnosis
                                                        </Button>
                                                        <Button variant="contained" color="secondary" onClick={() => cancelDocAppointment(row.id)}>
                                                            Cancel Appointment
                                                        </Button>
                                                        {/*<Button variant="contained" color="secondary">*/}
                                                        {/*    Modify Appointment*/}
                                                        {/*</Button>*/}
                                                        {/*<Button variant="contained" color="red">*/}
                                                        {/*    NO SHOW*/}
                                                        {/*</Button>*/}
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid2>
            </Box>
            <DiagnosisReportModal open={openDiagnosisModal}
                                  handleClose={() => setOpenDiagnosisModal(false)}
                                  doctorId={doctorId}
                                  appointmentDetail={selectedAppointment}
            />
            <EditDoctorDialog open={isEditDialogOpen}
                              onClose={() => setIsEditDialogOpen(false)}
                              initialDoctorData={doctorData}
                              disableFields={true}
                              onSave={handleSaveDoctor}/>
            <SetAvailabilityModal open={isAvailDialogOpen}
                                  onClose={() => setIsAvailDialogOpen(false)}
                                  doctorId={doctorId}/>
        </div>);
}

export default DoctorHomePage;