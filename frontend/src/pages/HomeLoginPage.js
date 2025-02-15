import React, {useState} from "react";
import {Box, Button, CircularProgress, Container, Grid2, TextField, Typography} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import {useNavigate} from "react-router-dom";
function HomeLoginPage() {
    const navigate = useNavigate();

    const buttons = [
        {
            label: "Login as Doctor",
            icon: <LocalHospitalIcon />,
            onClick: () => {
                navigate("/doctor-login");
            },
        },
        {
            label: "Login as Patient",
            icon: <PersonIcon />,
            onClick: () => navigate("/patient-login")
        },
        {
            label: "Login as Admin",
            icon: <SupervisorAccountIcon />,
            onClick: () => {
                navigate("/admin-login");
            },
        }
    ];
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Welcome to UME!
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Choose your login type
                </Typography>

                <Grid2
                    container
                    spacing={2}
                    sx={{
                        padding: 2,
                        width: '100%' // Ensures the Grid container stretches to fill the width of the parent
                    }}
                    direction={"column"}
                >
                    {buttons.map((button, index) => (
                        <Grid2 item xs={12} key={index}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={button.icon}
                                onClick={button.onClick}
                                sx={{
                                    textTransform: "none",
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
        </Container>

    );
}

export default HomeLoginPage;
