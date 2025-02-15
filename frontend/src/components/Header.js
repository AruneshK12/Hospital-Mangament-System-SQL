// Header.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import {Link, useLocation} from "react-router-dom";

function Header({ isAuthenticated, onLogout, userType }) {
  const location = useLocation();
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Unified Medical Ecosystem
        </Typography>
        {location.pathname !== '/home-login-page' && <Box>
          <Button component={Link} to={'/'} color="inherit">
            Logout
          </Button>
        </Box>}

      </Toolbar>
    </AppBar>
  );
}

export default Header;
