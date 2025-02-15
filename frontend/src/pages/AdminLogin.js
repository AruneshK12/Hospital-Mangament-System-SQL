import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { performLogin } from "../apis/AdminApis";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    // Handle login logic here
    e.preventDefault();
    if (email == "" || password == "") {
      setError(true);
    } else {
      setLoader(true);
      try {
        let response = await performLogin(email, password);
        if (response?.statusCode == 200) {
          setLoader(false);
          onLogin();
          navigate("/admin-home-page");
        }
      } catch (error) {
        console.log("error: ", error);
        setLoader(false);
        setError(true);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Admin Login
        </Typography>

        <TextField
          label="Email"
          type="email"
          error={error}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
          label="Password"
          type="password"
          error={error}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        {error && (
          <Typography color="red">Invalid Username or password</Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          fullWidth
          disabled={loader}
          style={{ marginTop: "20px" }}
        >
          {loader ? <CircularProgress /> : <>Login</>}
        </Button>
        <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/home-login-page')}
            fullWidth
            disabled={loader}
            style={{ marginTop: "20px" }}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  );
}

export default AdminLogin;
