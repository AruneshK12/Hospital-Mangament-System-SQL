import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    Checkbox,
    FormControlLabel,
    Box,
} from "@mui/material";

const EditPatientDialog = ({ open, onClose, initialPatientData, onSave }) => {
    const [editPatient, setEditPatient] = useState(initialPatientData || {});

    useEffect(() => {
        if (initialPatientData) {
            setEditPatient(initialPatientData);
        }
    }, [initialPatientData]);
    const [performEditCheck, setPerformEditCheck] = useState(false);

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
        { label: "Password", name: "Password", type: "password" },
    ];

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditPatient({ ...editPatient, [name]: value });
    };

    const handleSave = () => {
        onSave(editPatient);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Patient Details</DialogTitle>
            <DialogContent>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={performEditCheck}
                            onChange={() => setPerformEditCheck(!performEditCheck)}
                        />
                    }
                    label="Enable Edit"
                />

                {editPatientTextFields.map((field) => (
                    <TextField
                        key={field.name}
                        fullWidth
                        margin="normal"
                        label={field.label}
                        name={field.name}
                        type={field.type || "text"}
                        value={editPatient[field.name] || ""}
                        onChange={handleEditFormChange}
                        disabled={!performEditCheck || field.name === 'PatientId'}
                        InputLabelProps={{
                            shrink: true, // Keeps labels aligned for date inputs
                        }}
                        select={field.select || false}
                    >
                        {field.select &&
                            field.options.map((option) => (
                                <MenuItem key={option.charAt(0)} value={option.charAt(0)}>
                                    {option}
                                </MenuItem>
                            ))}
                    </TextField>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    variant="contained"
                    disabled={!performEditCheck}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPatientDialog;
