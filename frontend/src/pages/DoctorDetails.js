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
import {getAllHospitals} from "../apis/AdminApis";




function DoctorDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const {hospitalData} = location.state || {};

    const [hospitals, setHospitals] = useState([]);
    const [doctorMap, setDoctorMap] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [pageNo, setPageNo] = useState(0);
    const pageSize = 15;

    const [hospDoctorMap, setHospDoctorMap] = useState([]);
    const [hospTotalRows, setHospTotalRows] = useState(0);
    const [refinedSearch, setRefinedSearch] = useState(false);
    const [doctorData,setDoctorData] = useState(null);
    const [selectedHospitalId, setSelectedHospitalId] = useState(null); // Store the selected ID
    const [selectedRow, setSelectedRow] = useState(null); // For single selection

    const handleSelectionChange = (selectionModel) => {
        setSelectedRow(selectionModel[0] || null); // Store the first selected row ID or null
    };

    // console.log("doc data: ",doctorData);

    const handleSelectedChange = (event, newValue) => {
        if (newValue) {
            setSelectedHospitalId(newValue.id); // Update selected ID
        } else {
            setSelectedHospitalId(null); // Clear selection
        }
    };

    const setHospitalDetails = () => {
        if (hospitalData?.length > 0) {
            let tempHospitalList = []
            hospitalData?.map((hospital) => {
                tempHospitalList.push({
                    id: hospital?.HospitalId,
                    name: hospital?.HospitalName
                });
            });
            setHospitals(tempHospitalList);
        }
    }


    const viewDoctorDetails = () => {
        getDoctorData(selectedRow);
        setIsEditDialogOpen(true);
    }
    const getSelectedHospitalDoctors = async () => {
        try {
            setRefinedSearch(true);
            const response = await getHospitalDoctors(selectedHospitalId);
            const responseArray = response?.responseObject;
            setHospTotalRows(responseArray.length);
            let tempDoctorMap = []
            responseArray.map((doctor) => {
                tempDoctorMap.push({
                    id: doctor?.DoctorId,
                    firstName: doctor?.FirstName,
                    lastName: doctor?.LastName,
                    Gender: doctor?.Gender === 'M' ? 'Male' : doctor?.Gender === 'F' ? 'Female' : 'Others',
                    HospitalId: doctor?.HospitalId,
                    Phone: doctor?.Phone,
                    Price: "$" + doctor?.Price,
                    Rating: doctor?.Rating
                });
            });
            setHospDoctorMap(tempDoctorMap);
        } catch (error) {
            setHospTotalRows(0);
            setHospDoctorMap([]);
            console.log("error: ",error);
        }
    }
    const getAllDoctorsData = async () => {
        try {
            const response = await getAllDoctors(pageNo+1,pageSize);
            setTotalRows(response?.responseObject?.totalRows);
            let tempDoctorMap = []
            response?.responseObject?.doctors.map((doctor) => {
                tempDoctorMap.push({
                    id: doctor?.DoctorId,
                    firstName: doctor?.FirstName,
                    lastName: doctor?.LastName,
                    Gender: doctor?.Gender === 'M' ? 'Male' : doctor?.Gender === 'F' ? 'Female' : 'Others',
                    HospitalId: doctor?.HospitalId,
                    Phone: doctor?.Phone,
                    Price: "$" + doctor?.Price,
                    Rating: doctor?.Rating
                });
            });
            setDoctorMap(tempDoctorMap);
            console.log("doctorMap: ", tempDoctorMap);
        } catch (error) {
            console.log("error: ",error);
        }
    }
    const [loading, setLoading] = useState(false);
    const columns = [
        { field: "id", headerName: "Doctor Id", width: 200 },
        { field: "firstName", headerName: "First Name", width: 300 },
        { field: "lastName", headerName: "Last Name", width: 150 },
        { field: "Gender", headerName: "Gender", width: 300 },
        { field: "Phone", headerName: "Phone", width: 300 },
        { field: "Price", headerName: "Price", width: 150 },
        { field: "Rating", headerName: "Rating", width: 150 },
        { field: "HospitalId", headerName: "Hospital Id", width: 150 },

    ];

    const resetAllDoctors = () => {
        setPageNo(0);
        setRefinedSearch(false);
        setSelectedHospitalId(null);
    }
    useEffect(() => {
        setLoading(true);
        getAllDoctorsData();
        setLoading(false);
    },[pageNo]);


    useEffect(() => {
        setHospitalDetails();
    },[]);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

    const handleSaveDoctor = async (updatedData) => {
        console.log("Updated Doctor Data:", updatedData);
        const response = await editDoctorDetail(updatedData);
        if (response?.success === true) {
            alert("Doctor detail updated!");
            setIsEditDialogOpen(false);
        }
        // setDoctorData(updatedData);
    };


    return (
        <div style={{marginLeft: "3rem", marginRight: "3rem"}}>
            {/* Align welcome message at the start */}
            <Box
                display="block"
                textAlign="left"
                mb={2} // Add margin-bottom to separate sections
            >
                <Typography variant="h4" style={{ marginTop: "3rem", marginBottom: "1rem" }}>
                    Welcome to your doctor dashboard
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

                <Typography variant="h5" style={{ marginBottom: "1rem" }}>
                    Select Doctor By Hospital:
                </Typography>
                    <Autocomplete
                        options={hospitals}
                        getOptionLabel={(option) => option?.name}
                        // value={selectedHospital}
                        onChange={handleSelectedChange}
                        renderInput={(params) => <TextField {...params} label="Select Hospital" variant="outlined"/>}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => getSelectedHospitalDoctors()}
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
                    color="primary"
                    onClick={() => viewDoctorDetails()}
                    sx={{
                        textTransform: "none", // Keeps the button text from being all uppercase
                        fontWeight: "bold",
                        padding: 2,
                    }}
                    disabled={selectedRow === null}
                >
                    Edit Doctor
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => resetAllDoctors()}
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
                {/* <BarChart
          xAxis={[
            { scaleType: "band", data: ["group A", "group B", "group C"] },
          ]}
          series={[
            { data: [4, 3, 5] },
            { data: [1, 6, 3] },
            { data: [2, 5, 6] },
          ]}
          width={500}
          height={300}
        /> */}
                {loading ? (
                    <TableLoadingSkeleton />
                ) : (
                    <DataGrid
                        rows={refinedSearch ? hospDoctorMap : doctorMap}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: refinedSearch ? hospTotalRows : pageSize,
                                },
                            },
                        }}
                        pageSize={refinedSearch ? hospTotalRows : pageSize}
                        loading={loading}
                        rowCount={refinedSearch ? hospTotalRows : totalRows} // Total number of rows
                        paginationMode="server"
                        page={pageNo} // Controlled page number
                        onPaginationModelChange={(newPage) => setPageNo(newPage?.page)} // Update current page
                        checkboxSelection
                        disableRowSelectionOnClick
                        disableMultipleRowSelection
                        onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
                        rowSelectionModel={selectedRow ? [selectedRow] : []} // Bind selected row
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
            <EditDoctorDialog open={isEditDialogOpen}
                              onClose={() => setIsEditDialogOpen(false)}
                              initialDoctorData={doctorData}
                              disableFields={false}
                              onSave={handleSaveDoctor}/>
        </div>);
}

export default DoctorDetails;