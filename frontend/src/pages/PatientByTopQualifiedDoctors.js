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
    Typography, TextField, Autocomplete
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
import {useLocation, useNavigate, useParams} from "react-router-dom";
import EditDoctorDialog from "./EditDoctorDialog";
import {getPatientDetail} from "../apis/PatientApis";
import {editDoctorDetail, getAllDoctors, getDoctorDetail, getHospitalDoctors} from "../apis/DoctorApis";
import TableLoadingSkeleton from "../components/TableLoadingSkeleton";
import {getAllHospitals, getPatientsByDocRating, getPatientsByTopDoctors} from "../apis/AdminApis";




function PatientsByTopQualifiedDoctors() {
    const navigate = useNavigate();

    const [customerMap, setCustomerMap] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const pageSize = 15;
    const [rating,setRating] = useState(0.0);
    const [loading, setLoading] = useState(false);


    const getRatingBasedPatients = async () => {
        try {
            setLoading(true);
            const response = await getPatientsByTopDoctors(rating);
            const responseArray = response?.responseObject;
            setTotalRows(responseArray.length);
            let tempPatientMap = []
            let custId = 1;
            responseArray.map((patient) => {
                tempPatientMap.push({
                    id: custId,
                    firstName: patient?.FirstName,
                    lastName: patient?.LastName,
                    Gender: patient?.Gender === 'M' ? 'Male' : patient?.Gender === 'F' ? 'Female' : 'Others',
                    Phone: patient?.Phone,
                    Email: patient?.Email
                });
                custId = custId + 1;
            });
            setCustomerMap(tempPatientMap);
            setLoading(false);
        } catch (error) {
            setTotalRows(0);
            setCustomerMap([]);
            console.log("error: ",error);
            setLoading(false);
        }
    }

    const columns = [
        { field: "id", headerName: "Serial No.", width: 200 },
        { field: "firstName", headerName: "First Name", width: 300 },
        { field: "lastName", headerName: "Last Name", width: 150 },
        { field: "Gender", headerName: "Gender", width: 300 },
        { field: "Phone", headerName: "Contact Number", width: 150 },
        { field: "Email", headerName: "Contact Email", width: 300 }
    ];

    const resetRatingSearch = () => {
        setTotalRows(0);
        setRating(0.0);
        setCustomerMap([]);
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
                    View Top 100 Patients based on the Top doctor's rating
                </Typography>
            </Box>
            <Box
                display="flex"
                flexDirection="row" // Align items horizontally
                alignItems="center" // Center align vertically
                justifyContent="space-between" // Add space between elements
                height="auto" // Adjust height as needed
                gap="1rem" // Space between elements
            >

                <Typography variant="h6" style={{ marginBottom: "1rem",width:"10rem" }}>
                    Set Doctor's Rating:
                </Typography>
                <TextField fullWidth label="Rating" variant="outlined" />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => getRatingBasedPatients()}
                    sx={{
                        textTransform: "none", // Keeps the button text from being all uppercase
                        fontWeight: "bold",
                        padding: 2,
                    }}
                >
                    Search
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => resetRatingSearch()}
                    sx={{
                        textTransform: "none", // Keeps the button text from being all uppercase
                        fontWeight: "bold",
                        padding: 2,
                    }}
                >
                    Reset
                </Button>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="left"
                justifyContent="center"
                height="400"
            >
                {loading ? (
                    <TableLoadingSkeleton />
                ) : (
                    <DataGrid
                        rows={customerMap}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: pageSize,
                                },
                            },
                        }}
                        pageSize={pageSize}
                        loading={loading}
                        rowCount={totalRows} // Total number of rows
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                )}
            </Box>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/admin-home-page')}
                sx={{
                    textTransform: "none", // Keeps the button text from being all uppercase
                    fontWeight: "bold",
                    marginTop: "10px",
                    padding: 2,
                }}
            >
                Go Back
            </Button>
        </div>);
}

export default PatientsByTopQualifiedDoctors;