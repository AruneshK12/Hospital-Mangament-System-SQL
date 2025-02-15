import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid2, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Radio, Paper, DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {getAllLabTests, getMedicinesList, performDiagnosis} from "../apis/DoctorApis";
import {getPatientDetail} from "../apis/PatientApis";
import app from "../App";

const DiagnosisReportModal = ({ open, handleClose, doctorId, appointmentDetail }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    useEffect(() => {
        getAllLabTests();
        if (appointmentDetail !== null) {
            getPatientDetails(appointmentDetail?.patientId);
        }
    }, [appointmentDetail]);
    const [medicineSearchList,setMedicineSearchList] = useState([]);
    const [medicineSearchTerm, setMedicineSearchTerm] = useState("");
    const [labTestList, setLabTestList] = useState([]);
    const [selectedLabTestRow, setSelectedLabTestRow] = useState(null);

    const [patientDetail, setPatientDetail] = useState(null);
    const getPatientDetails = async (patientId) => {
        try {
            const response = await getPatientDetail(patientId);
            if (response?.responseObject) {
                setPatientDetail(response?.responseObject);
            }
        } catch (error) {
            console.log("error: ",error);
        }
    }
    const performMedicineSearch = async () => {
        setSelectedMedRow(null);
        const medicineListResp = await getMedicinesList(medicineSearchTerm);
        if (medicineListResp?.responseObject !== null) {
            let tempMedicineList = []
            medicineListResp?.responseObject.map((medicine) => {
                tempMedicineList.push(medicine);
            })
            setMedicineSearchList(tempMedicineList);
        }
    }

    const getAllLabTest = async () => {
        setSelectedLabTestRow(null);
        const labTestResp = await getAllLabTests();
        if (labTestResp?.responseObject?.labTests !== null) {
            let tempLabTestList = []
            labTestResp?.responseObject?.labTests.map((labTest) => {
                tempLabTestList.push(labTest);
            });
            setLabTestList(tempLabTestList);
        }
    }

    useEffect(() => {
        getAllLabTest();
    }, []);

    const [selectedMedRow, setSelectedMedRow] = useState(null);

    const handleSelect = (id) => {
        setSelectedMedRow(id);
    };

    const handleLabSelect = (id) => {
        setSelectedLabTestRow(id);
    }

    const [finalDiagnosisDetails, setFinalDiagnosisDetails] = useState({});
    const handleDiagnosis = () => {
        const medicineDet = medicineSearchList.find((row) => row.MedicineId === selectedMedRow);
        const labTestDet = labTestList.find((row) => row.LabTestId === selectedLabTestRow);
        let finalDiagTemp = {
            patientId: appointmentDetail?.patientId,
            patientName: patientDetail?.FirstName + " " + patientDetail?.LastName,
            appointmentId: appointmentDetail?.AppointmentId,
            appointmentDate: appointmentDetail?.AppointmentTime,
            medicineId: selectedMedRow,
            medicineName: medicineDet?.MedicineName,
            labTestId: selectedLabTestRow,
            labTestName: labTestDet?.LabTestName
        }
        setFinalDiagnosisDetails(finalDiagTemp);
        setOpenFinalModel(true);

    };

    const completeDiagnosis = async () => {
        try {
            let fdd = finalDiagnosisDetails;
            const response = await performDiagnosis(fdd.appointmentId, fdd.patientId, fdd.doctorId, fdd.medicineId, fdd.labTestId);
            console.log("response: ",response);
            alert("Patient Diagnosis Completed");
            setOpenFinalModel(false);
            handleClose();

        } catch(error) {
            console.log("error: ",error)
            setOpenFinalModel(false);
            handleClose();
        }
    }

    const [openFinalModel, setOpenFinalModel] = useState(false);

    return (
        <>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                Diagnosis Report
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    style={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {/* Patient Details Section */}
                <Accordion expanded={expanded === "patientDetails"} onChange={handleExpandChange("patientDetails")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Patient Details
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid2 container spacing={2}>
                            <Grid2 item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={patientDetail?.FirstName + " " + patientDetail?.LastName}
                                    variant="outlined"
                                    disabled={true}
                                />
                            </Grid2>
                            <Grid2 item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Gender"
                                    variant="outlined"
                                    value={patientDetail?.Gender === 'M' ? "Male" : patientDetail?.Gender === 'F' ? 'Female' : 'Others'}
                                    disabled={true}
                                />
                            </Grid2>
                            <Grid2 item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Date of Birth"
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    value={patientDetail?.DateOfBirth?.split('T')[0]}
                                    disabled={true}
                                />
                            </Grid2>
                        </Grid2>
                    </AccordionDetails>
                </Accordion>

                {/* Appointment Details Section */}
                <Accordion expanded={expanded === "appointmentDetails"} onChange={handleExpandChange("appointmentDetails")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Appointment Details
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid2 container spacing={2}>
                            <Grid2 item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Date"
                                    variant="outlined"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={appointmentDetail?.AppointmentDate.split('T')[0]}
                                />
                            </Grid2>
                            <Grid2 item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Time"
                                    variant="outlined"
                                    type="time"
                                    InputLabelProps={{ shrink: true }}
                                    value={appointmentDetail?.AvailableTime}
                                />
                            </Grid2>
                        </Grid2>
                    </AccordionDetails>
                </Accordion>

                {/* Patient Symptoms Section */}
                <Accordion expanded={expanded === "patientSymptoms"} onChange={handleExpandChange("patientSymptoms")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Patient Symptoms
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid2 container spacing={2}>
                            <Grid2 item xs={12} style={{width: "100%"}}>
                                <TextField fullWidth label="Symptoms" variant="outlined" multiline rows={4} />
                            </Grid2>
                        </Grid2>
                    </AccordionDetails>
                </Accordion>

                {/* Medicines Prescribed Section */}
                <Accordion expanded={expanded === "medicinesPrescribed"} onChange={handleExpandChange("medicinesPrescribed")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Medicines Prescribed
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid2 container spacing={2} style={{width: "100%"}}>
                            <Grid2 item xs={4} style={{alignContent: "center"}}>Search Medicine by Name or Manufacturer</Grid2>
                            <Grid2 item xs={4} >
                                <TextField
                                    fullWidth
                                    label="Search term"
                                    variant="outlined"
                                    value={medicineSearchTerm}
                                    onChange={(event) => setMedicineSearchTerm(event.target.value)} />
                            </Grid2>
                            <Grid2 item xs={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        textTransform: "none", // Keeps the button text from being all uppercase
                                        fontWeight: "bold",
                                        padding: 2,
                                    }}
                                    onClick={() => performMedicineSearch()}
                                >
                                    Search
                                </Button>
                            </Grid2>
                        </Grid2>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Select</TableCell>
                                        <TableCell>Medicine Id</TableCell>
                                        <TableCell>Medicine Name</TableCell>
                                        <TableCell>Dosage</TableCell>
                                        <TableCell>Manufacturer</TableCell>
                                        <TableCell>Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {medicineSearchList.map((row) => (
                                        <TableRow key={row.MedicineId} selected={row.MedicineId === selectedMedRow}>
                                            <TableCell>
                                                <Radio
                                                    checked={row.MedicineId === selectedMedRow}
                                                    onChange={() => handleSelect(row.MedicineId)}
                                                    value={row.MedicineId}
                                                />
                                            </TableCell>
                                            <TableCell>{row.MedicineId}</TableCell>
                                            <TableCell>{row.MedicineName}</TableCell>
                                            <TableCell>{row.Dosage}</TableCell>
                                            <TableCell>{row.Manufacturer}</TableCell>
                                            <TableCell>{"$" + row.Price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>

                {/* Labs Ordered Section */}
                <Accordion expanded={expanded === "labsOrdered"} onChange={handleExpandChange("labsOrdered")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Labs Ordered
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Select</TableCell>
                                        <TableCell>LabTestId</TableCell>
                                        <TableCell>LabTestName</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>OptimalRange</TableCell>
                                        <TableCell>Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {labTestList.map((row) => (
                                        <TableRow key={row.LabTestId} selected={row.LabTestId === selectedLabTestRow}>
                                            <TableCell>
                                                <Radio
                                                    checked={row.LabTestId === selectedLabTestRow}
                                                    onChange={() => handleLabSelect(row.LabTestId)}
                                                    value={row.LabTestId}
                                                />
                                            </TableCell>
                                            <TableCell>{row.LabTestId}</TableCell>
                                            <TableCell>{row.LabTestName}</TableCell>
                                            <TableCell>{row.Description}</TableCell>
                                            <TableCell>{row.OptimalRange}</TableCell>
                                            <TableCell>{"$" + row.Price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>

                {/* Follow-Up Remarks Section */}
                <Accordion expanded={expanded === "followUpRemarks"} onChange={handleExpandChange("followUpRemarks")}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        Follow-Up Remarks
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid2 container spacing={2}>
                            <Grid2 item xs={12}>
                                <TextField fullWidth label="Remarks" variant="outlined" multiline rows={4} />
                            </Grid2>
                        </Grid2>
                    </AccordionDetails>
                </Accordion>

                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "16px" }}
                    fullWidth
                    onClick={() => handleDiagnosis()}
                >
                    Save Report
                </Button>
            </DialogContent>
        </Dialog>
            <Dialog open={openFinalModel} onClose={() => setOpenFinalModel(false)} fullWidth maxWidth="md">
                <DialogTitle>
                    Final Report
                    <IconButton
                        aria-label="close"
                        onClick={()=> setOpenFinalModel(false)}
                        style={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid2 container spacing={2} direction={'column'}>
                        <Grid2 item xs={12}>
                            <Typography>
                                Appointment Id: {finalDiagnosisDetails?.appointmentId}
                            </Typography>
                            <Typography>
                                Appointment Date: {finalDiagnosisDetails?.appointmentDate}
                            </Typography>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <Typography>
                                Patient Id: {finalDiagnosisDetails?.patientId}
                            </Typography>
                            <Typography>
                                Patient Name: {finalDiagnosisDetails?.patientName}
                            </Typography>
                        </Grid2>
                        {finalDiagnosisDetails?.medicineId !== null && (<Grid2 item xs={12}>
                            <Typography>
                                Medicine Id: {finalDiagnosisDetails?.medicineId}
                            </Typography>
                            <Typography>
                                Medicine Name: {finalDiagnosisDetails?.medicineName}
                            </Typography>
                        </Grid2>)}
                        {finalDiagnosisDetails?.labTestId !== null && ( <Grid2 item xs={12}>
                            <Typography>
                                LabTest Id: {finalDiagnosisDetails?.labTestId}
                            </Typography>
                            <Typography>
                                LabTest Name: {finalDiagnosisDetails?.labTestName}
                            </Typography>
                        </Grid2>)}

                    </Grid2>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "16px" }}
                        fullWidth
                        onClick={() => completeDiagnosis()}
                    >
                        End Diagnosis
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DiagnosisReportModal;
