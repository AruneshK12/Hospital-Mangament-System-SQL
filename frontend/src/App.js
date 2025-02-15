import React, { useEffect, useState } from "react";
import "./App.css";
import AdminLogin from "./pages/AdminLogin";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomeLoginPage from "./pages/HomeLoginPage";
import AdminHomePage from "./pages/AdminHomePage";
import PatientOperations from "./pages/PatientOperations";
import CustomerLogin from "./pages/CustomerLogin";
import PatientHomePage from "./pages/PatientHomePage";
import DoctorHomePage from "./pages/DoctorHomePage";
import PatientHeatMap from "./pages/PatientHeatMap";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDetails from "./pages/DoctorDetails";
import FrequentPatients from "./pages/FrequentPatients";
import PatientsByDocRating from "./pages/PatientsByDocRating";
import PatientByTopQualifiedDoctors from "./pages/PatientByTopQualifiedDoctors";
import PatientTransactions from "./pages/PatientTransactions";
import DoctorLabReports from "./pages/DoctorLabReports";
import {Box} from "@mui/material";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const storeadAuthLogin = localStorage.getItem("isAuthenticated");
  // Check localStorage for authentication status on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  const [userType,setUserType] = useState("Patient");
  const [id, setId] = useState(null);
  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header
          isAuthenticated={storeadAuthLogin || isAuthenticated}
          onLogout={handleLogout}
          userType={userType}
          id={id}
        />
        <Routes>
            <Route path="/admin-login" element={
              <AdminLogin
                  onLogin={handleLogin}
                  setUserType={() => setUserType("Admin")}/>
            }/>
            <Route path="/patient-login" element={
              <CustomerLogin
                  onLogin={handleLogin}
                  setUserType={() => setUserType("Patient")}
                  setId={(id) => setId(id)}
              />
            }/>
            <Route path="/doctor-login" element={
              <DoctorLogin
                  onLogin={handleLogin}
                  setUserType={() => setUserType("Doctor")}
                  setId={(id) => setId(id)}
              />
            }/>
            <Route path="/patient-home-page/:patientId" element={<PatientHomePage />}/>
            <Route path="/doctor-home-page/:doctorId" element={<DoctorHomePage/>}/>
            <Route path={"/doctor-details"} element={<DoctorDetails/>}/>
            <Route path={"/doctor-lab-reports/:doctorId"} element={<DoctorLabReports/>}/>
          {/*<Route*/}
          {/*  path="/home"*/}
          {/*  element={*/}
          {/*    storeadAuthLogin || isAuthenticated ? (*/}
          {/*      <Home />*/}
          {/*    ) : (*/}
          {/*      <Navigate to="/login" />*/}
          {/*    )*/}
          {/*  }*/}
          {/*/>*/}
          <Route
            path="/admin-home-page"
            element={<AdminHomePage />}
          />
          <Route
              path="/frequent-patients"
              element={<FrequentPatients/>}
          />
          <Route
              path="/patients-by-doctor-rating"
              element={<PatientsByDocRating/>}
          />
          <Route path="/patients-by-top-doctors" element={<PatientByTopQualifiedDoctors/>}/>
          <Route path="/patient-transactions/:patientId" element={<PatientTransactions/>}/>
          <Route
            path="/patient-operations"
            element={
                <PatientOperations />
            }
          />
          <Route path={"/home-login-page"} element={<HomeLoginPage/>}/>
          <Route path="/patient-statistics" element={<PatientHeatMap/>}/>
          <Route path="*" element={<Navigate to="/home-login-page" />} />
        </Routes>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
