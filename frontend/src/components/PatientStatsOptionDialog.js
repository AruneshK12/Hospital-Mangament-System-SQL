import {Button, Dialog, DialogContent, DialogTitle, Grid2, Typography} from "@mui/material";
import React from "react";

function PatientStatsOptionDialog({open, onClose, buttons}) {

    return (<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Choose Patient Statistics</DialogTitle>
        <DialogContent>
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
        </DialogContent>
    </Dialog>);
}

export default PatientStatsOptionDialog;