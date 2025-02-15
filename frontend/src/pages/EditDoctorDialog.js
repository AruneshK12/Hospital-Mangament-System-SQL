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

const EditDoctorDialog = ({ open, onClose, initialDoctorData, onSave, disableFields }) => {
    const [editDoctor, setEditDoctor] = useState(initialDoctorData || {});

    useEffect(() => {
        if (initialDoctorData) {
            setEditDoctor(initialDoctorData);
        }
    }, [initialDoctorData]);
    const [performEditCheck, setPerformEditCheck] = useState(false);

    const editDoctorTextFields = [
        { label: "Doctor ID", name: "DoctorId", disabled: true },
        { label: "First Name", name: "FirstName" },
        { label: "Last Name", name: "LastName" },
        {
            label: "Gender",
            name: "Gender",
            select: true,
            options: ["Male", "Female", "Other"],
        },
        { label: "Rating", name: "Rating", type: "number", disabled: disableFields },
        { label: "Price", name: "Price", type: "number", disabled: disableFields },
        { label: "Phone", name: "Phone" },
        { label: "Email", name: "Email", type: "email" },
        { label: "Password", name: "Password", type: "password" },
    ];

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditDoctor({ ...editDoctor, [name]: value });
    };

    const handleSave = () => {
        onSave(editDoctor);
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

                {editDoctorTextFields.map((field) => (
                    <TextField
                        key={field.name}
                        fullWidth
                        margin="normal"
                        label={field.label}
                        name={field.name}
                        type={field.type || "text"}
                        value={editDoctor[field.name] != null ? editDoctor[field.name] : ""}
                        onChange={handleEditFormChange}
                        disabled={!performEditCheck || field?.disabled === true}
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

export default EditDoctorDialog;
