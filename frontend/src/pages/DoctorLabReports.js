import React, {useEffect, useState} from "react";
import {
    Box,
    Button, Collapse, Grid2, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography,
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useNavigate, useParams} from "react-router-dom";
import TableLoadingSkeleton from "../components/TableLoadingSkeleton";
import {getFrequentCustomers} from "../apis/AdminApis";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import {getDoctorLabReports, getPendingLabReports} from "../apis/DoctorApis";
import moment from "moment";

function DoctorLabReports() {
    const navigate = useNavigate();
    const {doctorId} = useParams();

    const [labReportList, setLabReportList] = useState([]);

    const getDoctorLabReportData = async () => {
        try {
            const response = await getPendingLabReports(doctorId);
            let tempReportArr = [];
            response?.responseObject?.map((report) => {
                tempReportArr.push({
                    id: report?.OrderId,
                    name: report.LabTestName,
                    appointmentId: report?.AppointmentId,
                    patientName: report?.PatientName,
                    description: report.Description,
                    optimalRange: report.OptimalRange,
                    price: report.Price,
                    OrderTimestamp: report?.OrderedTimestamp? moment(report?.OrderedTimestamp).format('MMM Do YYYY h:mm a') : ''
                });
            });
            setLabReportList(tempReportArr);
        } catch (error) {
            console.log("error: ",error);
        }
    }

    useEffect(() => {
        getDoctorLabReportData();
    },[]);


    return (
        <div style={{marginLeft: "3rem", marginRight: "3rem"}}>
            {/* Align welcome message at the start */}
            <Box
                display="flex"
                flexDirection="column"
                alignItems="left"
                justifyContent="center"
                marginTop="2rem"
            >
                <Typography variant="h4" style={{ marginBottom: "1rem" }}>
                    Pending Lab Reports
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
                                    <TableCell>{"Report Id"}</TableCell>
                                    <TableCell>{"Report Name"}</TableCell>
                                    <TableCell>{"Requested Appointment Id"}</TableCell>
                                    <TableCell>{"Patient Name"}</TableCell>
                                    <TableCell>{"Report Description"}</TableCell>
                                    <TableCell>{"Optimal Range"}</TableCell>
                                    <TableCell>{"Report price"}</TableCell>
                                    <TableCell>{"Order date"}</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {labReportList.map((row) => (
                                    <React.Fragment key={row.id}>
                                        <TableRow>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.appointmentId}</TableCell>
                                            <TableCell>{row.patientName}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>{row.optimalRange}</TableCell>
                                            <TableCell>{row.price}</TableCell>
                                            <TableCell>{row.OrderTimestamp}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid2>
            </Box>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/doctor-home-page/' + doctorId)}
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

export default DoctorLabReports;