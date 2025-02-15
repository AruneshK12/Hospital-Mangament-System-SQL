import apiConfig from "../apiConfig";

const GET_ALL_DOCTORS_URL = "/doctors";
const GET_DOCTOR_DETAIL_URL = "/doctors/";
const GET_HOSPITAL_DOCTORS_URL = "/doctors/hospital/";
const UPDATE_DOCTOR_DETAILS_URL = "/doctors/update";
const DOCTOR_SIGN_IN_URL = "/doctors/sign-in";
const MEDICINE_SEARCH_URL = "/medicines/search";
const GET_ALL_LAB_TESTS_URL = "/lab-tests";
const SET_DOCTOR_AVAILABILITY_URL = "/doctors/add-availability"
const GET_DOCTOR_APPOINTMENTS_URL = "/appointments/doctor/";
const PERFORM_DIAGNOSIS_URL = "/diagnosis";
const GET_DOCTOR_LAB_REPORTS_URL = "/lab-tests/doctor/";
const CANCEL_APPOINTMENT_URL = "/doctors/appointment/";
const GET_DOCTOR_DASHBOARD_URL = "/doctors/{doctorId}/appointments-summary";
const GET_PENDING_LABS_URL = "/doctors/{doctorId}/lab-reports-pending";
const BASE_URL = apiConfig.baseURL;

export const performDoctorLogin = async (email, password) => {
    let requestBody = {email, password};
    let apiUrl = BASE_URL + DOCTOR_SIGN_IN_URL;

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
        console.log("Doctor login successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during patient login:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const getDoctorDetail = async (doctorId) => {
    let apiUrl = BASE_URL + GET_DOCTOR_DETAIL_URL + doctorId;
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

export const getHospitalDoctors = async (hospitalId) => {
    let apiUrl = BASE_URL + GET_HOSPITAL_DOCTORS_URL + hospitalId;
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

export const getAllDoctors = async (page,limit) => {
    let apiUrl = BASE_URL + GET_ALL_DOCTORS_URL + "?page=" + page+"&limit=" + limit;
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

export const editDoctorDetail = async (doctorDetail) => {
    let apiUrl = BASE_URL + UPDATE_DOCTOR_DETAILS_URL;
    try {
        const response = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(doctorDetail),
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

export const getMedicinesList = async (searchStr) => {
    let apiUrl = BASE_URL + MEDICINE_SEARCH_URL + "?searchString=" + searchStr;
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

export const getAllLabTests = async () => {
    let apiUrl = BASE_URL + GET_ALL_LAB_TESTS_URL;
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

export const getDoctorAppointments = async (doctorId) => {
    let apiUrl = BASE_URL + GET_DOCTOR_APPOINTMENTS_URL + doctorId;
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

export const getDoctorLabReports = async (doctorId) => {
    let apiUrl = BASE_URL + GET_DOCTOR_LAB_REPORTS_URL + doctorId;
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

export const setDoctorAvailability = async (start_date,end_date,doctorId) => {
    let apiUrl = BASE_URL + SET_DOCTOR_AVAILABILITY_URL;
    let reqBody = {
        doctorId: doctorId,
        startDate: start_date,
        endDate: end_date
    }
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Post successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during Post:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const performDiagnosis = async (appId,patId,docId,medId,labId) => {
    let apiUrl = BASE_URL + PERFORM_DIAGNOSIS_URL;
    let reqBody = {
        "AppointmentId": appId,
        "PatientId": patId,
        "DoctorId": docId,
        "MedicineId": medId,
        "LabTestId": labId
    }
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Post successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during Post:", error);
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
        console.log("Post successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during Post:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const getDoctorDashboard = async (doctorId) => {
    let apiUrl = BASE_URL + GET_DOCTOR_DASHBOARD_URL.replace("{doctorId}",doctorId);
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
        console.log("Post successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during Post:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

export const getPendingLabReports = async (doctorId) => {
    let apiUrl = BASE_URL + GET_PENDING_LABS_URL.replace("{doctorId}",doctorId);
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
        console.log("Post successful:", data);
        return data; // Return data if needed
    } catch (error) {
        console.error("Error during Post:", error);
        throw error; // Rethrow the error for further handling if needed
    }
};

