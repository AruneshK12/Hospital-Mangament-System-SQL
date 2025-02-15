import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid2,
  Typography,
} from "@mui/material";
import { DataGrid} from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import {getAdminDashboard, getAdminStats, getAllHospitals} from "../apis/AdminApis";
import TableLoadingSkeleton from "../components/TableLoadingSkeleton";
import PatientStatsOptionDialog from "../components/PatientStatsOptionDialog";


function AdminHomePage() {
  const [hospitalMap, setHospitalMap] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { field: "id", headerName: "Index", width: 200 },
    { field: "hospName", headerName: "Hospital Name", width: 300 },
    { field: "hospDocCount", headerName: "Total doctors", width: 150 },
    { field: "hospAvgRating", headerName: "Average Rating", width: 150 },
  ];
  const fetchDashboardData = async () => {
    try {
      const data = await getAdminDashboard();
      if (hospitalMap?.length == 0) {
        let tempMap = [];
        let hospitalId = 1;
        data?.responseObject?.map((hospDetail) => {
          tempMap.push({
            id: hospitalId,
            hospName: hospDetail?.HospitalName,
            hospDocCount: hospDetail?.DocCount,
            hospAvgRating: hospDetail?.AverageHospitalRating,
          });
          hospitalId = hospitalId + 1;
        });
        setHospitalMap(tempMap);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const [allHospitalData, setAllHospitalData] = useState([]);
  const getAllHospitalsData = async () => {
    try {
      const response = await getAllHospitals();
      setAllHospitalData(response?.responseObject?.hospitals);
    } catch (error) {
      console.log("error: ",error);
    }
  }

  const getAdminMetrics = async () => {
    try {
      const response = await getAdminStats();
      if (response?.responseObject) {
        setMetrics([{ label: "Total Appointments", value: response?.responseObject?.TotalAppointmentsToday },
          { label: "Total Hospitals", value: response?.responseObject?.TotalHospitals },
          { label: "Total Doctors", value: response?.responseObject?.TotalDoctors }]);
      }
    } catch (error) {
      console.log("error: ",error)
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
    getAllHospitalsData();
    getAdminMetrics();
  }, []);

  const [metrics,setMetrics] = useState([
    { label: "Total Appointments", value: 0 },
    { label: "Total Hospitals", value: 0 },
    { label: "Total Doctors", value: 0 },
  ]);


  const buttons = [
    {
      label: "Add/Edit New Patient",
      icon: <AddCircleOutlineIcon />,
      onClick: () => {
        navigate("/patient-operations");
      },
    },
    {
      label: "Check Hospital Details",
      icon: <LocalHospitalIcon />,
      onClick: () => alert("Check Hospital Details clicked"),
    },
    {
      label: "Check Patient Statistics",
      icon: <CalendarTodayIcon />,
      onClick: () => {
        setOpenPatientStats(true);
      },
    },
    {
      label: "Check Doctor Details",
      icon: <PersonIcon />,
      onClick: () => navigate("/doctor-details", {state: {hospitalData: allHospitalData}}),
    },
  ];

  const [openPatientStats, setOpenPatientStats] = useState(false);

  const patientStatsButtons = [
    {
      label: "View Frequent Patients",
      icon: <AddCircleOutlineIcon />,
      onClick: () => {
        navigate('/frequent-patients')
      },
    },
    {
      label: "View Patients by Doctor Rating",
      icon: <LocalHospitalIcon />,
      onClick: () => navigate('/patients-by-doctor-rating'),
    },
    {
      label: "View Patients by Top Doctors Rating",
      icon: <LocalHospitalIcon />,
      onClick: () => navigate('/patients-by-top-doctors'),
    },
    {
      label: "View Patient Condition Statistics",
      icon: <PersonIcon />,
      onClick: () => {
        navigate("/patient-statistics");
      },
    }
  ];

  return (
    <div style={{ marginLeft: "3rem", marginRight: "3rem" }}>
      {/* Align welcome message at the start */}
      <Box
        display="block"
        textAlign="left"
        mb={4} // Add margin-bottom to separate sections
      >
        <Typography variant="h3" style={{ marginBottom: "2rem" }}>
          Today's Dashboard
        </Typography>
        <Box sx={{ padding: 2 }}>
          <Grid2 container spacing={2}>
            {metrics.map((metric, index) => (
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
        {/* <Box display="flex" alignItems="center">
          <Typography>Select from top 50 Hosptials</Typography>
          <FormControl style={{ width: "20rem", marginLeft: "10px" }}>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currHospId}
              label="Hospital Name"
              onChange={handleChange}
            >
              {hospitalMap.map((hospDetail) => {
                return (
                  <MenuItem value={hospDetail?.hospId}>
                    {hospDetail?.hospName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box> */}
      </Box>
      {/* Center align the rest of the content */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        justifyContent="center"
        height="400"
      >
        <Typography variant="h3" style={{ marginBottom: "1rem" }}>
          Hospitals Data
        </Typography>
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
            rows={hospitalMap}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[100]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        justifyContent="center"
        marginTop="2rem"
      >
        <Typography variant="h3" style={{ marginBottom: "1rem" }}>
          Perform Admin Operations
        </Typography>
        <Grid2 container spacing={2} sx={{ padding: 2 }}>
          {buttons.map((button, index) => (
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
      <PatientStatsOptionDialog buttons={patientStatsButtons}
                                onClose={() => setOpenPatientStats(false)}
                                open={openPatientStats}/>
    </div>
  );
}

export default AdminHomePage;
