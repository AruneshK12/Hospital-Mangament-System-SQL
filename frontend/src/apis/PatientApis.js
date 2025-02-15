import apiConfig from "../apiConfig";

const GET_PATIENT_DETAIL_URL = "/patients/";
const ADD_PATIENT_DETAIL_URL = "/patients/add";
const EDIT_PATIENT_DETAIL_URL = "/patients/update";
const DELETE_PATIENT_DETAIL_URL = "/patients/";
const LOGIN_PATIENT_URL = "/patients/sign-in";
const PATIENT_METRICS_URL = "/patients/metrics";
const VIEW_PATIENT_TRANSACTIONS = "/patients/{patient_id}/transactions"
const GET_ALL_APPOINTMENTS_URL = "/appointments/patient/";
const GET_AVAILABLE_APPOINT_URL = "/appointments/doctor/{doctorId}/available";
const GET_ALL_AVAIL_DOCTORS_HOSP_URL = "/appointments/hospital/{hospitalId}/available"
const PERFORM_APPOINTMENT_URL = "/patients/make-appointment";
const CANCEL_APPOINTMENT_URL = "/patients/appointment/";
const MODIFY_APPOINTMENT_URL = "/patients/appointment/modify";
const BASE_URL = apiConfig.baseURL;

export const getPatientDetail = async (patientId) => {
    let apiUrl = BASE_URL + GET_PATIENT_DETAIL_URL + patientId;
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetch successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const addPatientDetail = async (patientDetail) => {
    let apiUrl = BASE_URL + ADD_PATIENT_DETAIL_URL;
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patientDetail),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetch successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const editPatientDetail = async (patientDetail) => {
    let apiUrl = BASE_URL + EDIT_PATIENT_DETAIL_URL;
    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patientDetail),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetch successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const deletePatientDetail = async (patientId) => {
    let apiUrl = BASE_URL + DELETE_PATIENT_DETAIL_URL + patientId;
    try {
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetch successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const performPatientLogin = async (email, password) => {
    let requestBody = {email, password};
    let apiUrl = BASE_URL + LOGIN_PATIENT_URL;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Patient login successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during patient login:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const cancelAppointment = async (appId) => {
    let apiUrl = BASE_URL + CANCEL_APPOINTMENT_URL + appId;

    try {
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Patient Cancellation successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during patient cancellation:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const performModifyAppointment = async (docId,appId,patId,newTs) => {
    let apiUrl = BASE_URL + MODIFY_APPOINTMENT_URL;
    let reqBody = {
        PatientId: patId,
        DoctorId: docId,
        AppointmentId: appId,
        NewTimestamp: newTs
    };

    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Patient Modification successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during patient modification:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};
export const performBookAppointment = async (patientId, doctorId, appointTime) => {
    let requestBody = {
        PatientId: patientId,
        DoctorId: doctorId,
        Timestamp: appointTime
    };
    let apiUrl = BASE_URL + PERFORM_APPOINTMENT_URL;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Patient Appointment successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during patient login:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const getPatientMetricDetail = async (patientId) => {
    let apiUrl = BASE_URL + PATIENT_METRICS_URL + "?PatientId=" + patientId;
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetch successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const getPatientTransactions = async (patientId) => {
    let apiUrl = BASE_URL + VIEW_PATIENT_TRANSACTIONS.replace("{patient_id}",patientId);
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetch successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const getPatientAppointments = async (patientId) => {
    let apiUrl = BASE_URL + GET_ALL_APPOINTMENTS_URL + patientId;
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetch successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const getAvailableAppointments = async (doctorId, appointDate) => {
    let apiUrl = BASE_URL + GET_AVAILABLE_APPOINT_URL.replace("{doctorId}",doctorId) + "?date=" + appointDate;
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetch successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const getAvailableAppointmentsHospital = async (hospitalId, appointDate) => {
    let apiUrl = BASE_URL +
        GET_ALL_AVAIL_DOCTORS_HOSP_URL.replace("{hospitalId}",hospitalId) + "?date=" + appointDate;
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetch successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during fetch:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};