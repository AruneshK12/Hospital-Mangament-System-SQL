import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import {
  Container,
  TextField,
  Grid2,
  Box,
  Button,
  Typography,
  IconButton,
  MenuItem,
  AppBar,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddCircleOutline } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import {
  addPatientDetail,
  deletePatientDetail,
  editPatientDetail,
  getPatientDetail,
} from "../apis/PatientApis";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {useNavigate} from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function PatientOperations() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [deletePatientId, setDeletePatientId] = useState("");
  const [editPatientId, setEditPatientId] = useState("");
  const [patient, setPatient] = useState({
    PatientId: "",
    FirstName: "",
    LastName: "",
    DateOfBirth: "",
    Gender: "",
    Address: "",
    Phone: "",
    Email: "",
    Pass: "",
  });
  const [editPatient, setEditPatient] = useState({
    PatientId: "",
    FirstName: "",
    LastName: "",
    Email: "",
  });

  const [performEditCheck, setPerformEditCheck] = useState(false);

  const handleAddPatient = async (patientData) => {
    let patientGender = "O";
    if (patientData?.Gender == "Male") {
      patientGender = "M";
    } else if (patientData?.Gender == "Female") {
      patientGender = "F";
    }
    let patientDetail = {
      FirstName: patientData?.FirstName,
      LastName: patientData?.LastName,
      DateOfBirth: patientData?.DateOfBirth,
      Gender: patientGender,
      Address: patientData?.Address,
      Phone: patientData?.Phone,
      Email: patientData?.Email,
      Password: patientData?.Pass,
    };
    try {
      const data = await addPatientDetail(patientDetail);
      alert("Patient details added successfully!");
    } catch (error) {
      console.log("error: ", error);
      alert("There was an error in adding the patient details!");
    }
  };

  const fetchPatientDetails = async (patId) => {
    try {
      const data = await getPatientDetail(patId);
      if (data?.message == "Patient found") {
        return data?.responseObject;
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return null;
    }
  };
  const handleViewPatient = async (currPatientId) => {
    setPerformEditCheck(false)
    setEditPatient({
      PatientId: "",
      FirstName: "",
      LastName: "",
      DateOfBirth: "",
      Gender: "",
      Address: "",
      Phone: "",
      Email: "",
      Pass: "",
    });
    const patientData = await fetchPatientDetails(currPatientId);
    if (patientData != null) {
      let patientGender = "Other";
      if (patientData?.Gender == "M") {
        patientGender = "Male";
      } else if (patientData?.Gender == "F") {
        patientGender = "Female";
      }
      setEditPatient({
        PatientId: currPatientId,
        FirstName: patientData?.FirstName,
        LastName: patientData?.LastName,
        DateOfBirth: String(patientData?.DateOfBirth).substring(0, 10),
        Gender: patientGender,
        Address: patientData?.Address,
        Phone: patientData?.Phone,
        Email: patientData?.Email,
        Pass: patientData?.Password,
      });
    } else {
      alert("Patient Details not found");
    }
  };

  const handleEditPatient = async (patientData) => {
    let patientGender = "O";
    if (patientData?.Gender == "Male") {
      patientGender = "M";
    } else if (patientData?.Gender == "Female") {
      patientGender = "F";
    }
    let patientDetail = {
      FirstName: patientData?.FirstName,
      LastName: patientData?.LastName,
      DateOfBirth: patientData?.DateOfBirth,
      Gender: patientGender,
      Address: patientData?.Address,
      Phone: patientData?.Phone,
      Email: patientData?.Email,
      Password: patientData?.Pass,
    };
    const data = await editPatientDetail(patientDetail);
  };
  const handleSave = (patientData) => {
    handleAddPatient(patientData);
  };

  const handleEditSave = (patientData) => {
    handleEditPatient(patientData);
    alert("Patient details saved successfully!");
  };

  const [deletePatientData, setDeletePatientData] = useState({
    PatientId: "",
    FirstName: "",
    LastName: "",
    DateOfBirth: "",
    Gender: "",
    Address: "",
    Phone: "",
    Email: "",
    Pass: "",
  });

  const handleDelete = async () => {
    const patientData = await fetchPatientDetails(deletePatientId);
    if (patientData != null) {
      setDeletePatientData({
        PatientId: deletePatientId,
        FirstName: patientData?.FirstName,
        LastName: patientData?.LastName,
        Email: patientData?.Email,
        Pass: patientData?.Password,
      });
      setOpenModal(true);
    } else {
      alert("Patient does not exist");
    }
  };

  const performDelete = async () => {
    const data = await deletePatientDetail(deletePatientId);
    console.log("data: ", data);
    if (data?.statusCode == 200) {
      setOpenModal(false);
      alert("Patient Data deleted successfully!");
    }
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditPatient({ ...editPatient, [name]: value });
  };

  const addPatientTextFields = [
    // { label: "Patient ID", name: "PatientId" },
    { label: "First Name", name: "FirstName" },
    { label: "Last Name", name: "LastName" },
    { label: "Date of Birth", name: "DateOfBirth", type: "date" },
    {
      label: "Gender",
      name: "Gender",
      select: true,
      options: ["Male", "Female", "Other"],
    },
    { label: "Address", name: "Address" },
    { label: "Phone", name: "Phone" },
    { label: "Email", name: "Email", type: "email" },
    { label: "Password", name: "Pass", type: "password" },
  ];

  const editPatientTextFields = [
    { label: "Patient ID", name: "PatientId" },
    { label: "First Name", name: "FirstName" },
    { label: "Last Name", name: "LastName" },
    { label: "Date of Birth", name: "DateOfBirth", type: "date" },
    {
      label: "Gender",
      name: "Gender",
      select: true,
      options: ["Male", "Female", "Other"],
    },
    { label: "Address", name: "Address" },
    { label: "Phone", name: "Phone" },
    { label: "Email", name: "Email", type: "email" },
    { label: "Password", name: "Pass", type: "password" },
  ];

  const deletePatientTextFields = [{ label: "Patient ID", name: "PatientId" }];

  const [openModel, setOpenModal] = useState(false);
  return (
    <div style={{ marginLeft: "3rem", marginRight: "3rem" }}>
      <Container maxWidth="md" sx={{ ml: 4, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Perform Patient Operations
        </Typography>
      </Container>
      <Box
        sx={{
          width: "auto",
          border: "2px solid #1976d2",
          borderRadius: "8px",
        }}
      >
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab
              label="Add New Patient"
              icon={<AddCircleOutline />}
              {...a11yProps(0)}
            />
            <Tab
              label="View Patient Details"
              icon={<PersonIcon />}
              {...a11yProps(1)}
            />
            <Tab
              label="Delete Patient Details"
              icon={<DeleteIcon />}
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid2 container spacing={3} direction={"column"}>
            {addPatientTextFields?.map((field) => (
              <Grid2
                item
                xs={12}
                sm={field.name === "Gender" ? 6 : 12}
                key={field.name}
              >
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={patient[field.name]}
                  InputLabelProps={{
                    shrink: field.type === "date" ? true : undefined, // Ensures the label does not overlap the date picker
                  }}
                  onChange={handleFormChange}
                  select={field.select || false}
                >
                  {field.select &&
                    field.options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid2>
            ))}
            <Grid2 item xs={6} sm={"Patient Id"} key={"Patient Id"}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<AddCircleOutline />}
                onClick={() => handleSave(patient)}
                sx={{
                  textTransform: "none", // Keeps the button text from being all uppercase
                  fontWeight: "bold",
                  padding: 2,
                }}
              >
                <Typography variant="button">{"Add Patient"}</Typography>
              </Button>
            </Grid2>
          </Grid2>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid2 container spacing={3} direction={"column"}>
            <Grid2 item xs={6} sm={"Patient Id"} key={"Patient Id"}>
              <TextField
                fullWidth
                label={"Patient Id"}
                name={"Patient Id"}
                type={"text"}
                value={editPatientId}
                onChange={(e) => {
                  setEditPatientId(e.target.value);
                }}
              />
            </Grid2>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<PersonIcon />}
              onClick={() => handleViewPatient(editPatientId)}
              sx={{
                textTransform: "none", // Keeps the button text from being all uppercase
                fontWeight: "bold",
                padding: 2,
              }}
            >
              <Typography variant="button">{"View Patient"}</Typography>
            </Button>
            <FormControlLabel
              control={
                <Checkbox
                  value={performEditCheck}
                  onClick={() => setPerformEditCheck(!performEditCheck)}
                />
              }
              label="Perform Edit operation"
            />
            {addPatientTextFields?.map((field) => (
              <>
                <Grid2
                  item
                  xs={field.name == "PatientId" ? 6 : 12}
                  sm={field.name === "Gender" ? 6 : 12}
                  key={field.name}
                >
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type || "text"}
                    value={editPatient[field.name]}
                    InputLabelProps={{
                      shrink: true, // Ensures the label does not overlap the date picker
                    }}
                    onChange={handleEditFormChange}
                    select={field.select || false}
                    disabled={!performEditCheck}
                  >
                    {field.select &&
                      field.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid2>
              </>
            ))}
            <Grid2 item xs={6} sm={"Patient Id"} key={"Patient Id"}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<PersonIcon />}
                onClick={() => handleEditSave(editPatient)}
                sx={{
                  textTransform: "none", // Keeps the button text from being all uppercase
                  fontWeight: "bold",
                  padding: 2,
                }}
              >
                <Typography variant="button">{"Save Patient"}</Typography>
              </Button>
            </Grid2>
          </Grid2>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Grid2 container spacing={3} direction={"column"}>
            <Grid2 item xs={6} sm={"Patient Id"} key={"Patient Id"}>
              <TextField
                fullWidth
                label={"Patient Id"}
                name={"Patient Id"}
                type={"text"}
                value={deletePatientId}
                onChange={(e) => {
                  setDeletePatientId(e.target.value);
                }}
              />
            </Grid2>
            <Grid2 item xs={6} sm={"Patient Id"} key={"Patient Id"}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{
                  textTransform: "none", // Keeps the button text from being all uppercase
                  fontWeight: "bold",
                  padding: 2,
                }}
              >
                <Typography variant="button">{"Delete Patient"}</Typography>
              </Button>
            </Grid2>
          </Grid2>
        </TabPanel>
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

      <Dialog
        open={openModel}
        onClose={() => setOpenModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to delete the patient details?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography gutterBottom>
              You are deleting the patient details with the following:
            </Typography>
            <Typography gutterBottom>
              Patient Id: {deletePatientData?.PatientId}
            </Typography>
            <Typography gutterBottom>
              Patient Name:{" "}
              {deletePatientData?.FirstName + " " + deletePatientData?.LastName}
            </Typography>
            <Typography gutterBottom>
              Patient Email: {deletePatientData?.Email}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Disagree</Button>
          <Button onClick={performDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default PatientOperations;
