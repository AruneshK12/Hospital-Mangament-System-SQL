import apiConfig from "../apiConfig";

const GET_ADMIN_DASHBOARD_URL = "/admin/doctors-count-per-hospital";
const GET_FREQ_CUSTOMERS_URL = "/admin/frequent-customers";
const GET_PATIENTS_BY_DOC_RATING_URL = "/admin/patients-by-doctor-rating";
const GET_PATIENTS_BY_TOP_DOC_URL = "/admin/patients-by-top-qualified-doctors";
const GET_ALL_HOSPTIALS_URL = "/hospitals";
const ADMIN_LOGIN_URL = "/admin/login";
const GET_PATIENT_HEAT_MAP = "/admin/patient-coordinate-counts"
const GET_ADMIN_STATS_URL = "/admin/combined-stats";
const BASE_URL = apiConfig.baseURL;

export const getAdminDashboard = async () => {
  let apiUrl = BASE_URL + GET_ADMIN_DASHBOARD_URL;
  try {
    const response = await fetch(apiUrl, {
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

export const getAllHospitals = async () => {
  let apiUrl = BASE_URL + GET_ALL_HOSPTIALS_URL + "?page=1&limit=6100";
  try {
    const response = await fetch(apiUrl, {
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


export const performLogin = async (email, password) => {
  let requestBody = { email, password };
  let apiUrl = BASE_URL + ADMIN_LOGIN_URL;

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
    console.log("AdminLogin successful:", data);
    return data; // Return data if needed
  } catch (error) {
    console.error("Error during login:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export const getFrequentCustomers = async () => {
  let apiUrl = BASE_URL + GET_FREQ_CUSTOMERS_URL;
  try {
    const response = await fetch(apiUrl, {
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

export const getPatientsByDocRating = async (rating) => {
  let apiUrl = BASE_URL + GET_PATIENTS_BY_DOC_RATING_URL + "?rating=" + rating;
  try {
    const response = await fetch(apiUrl, {
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

export const getPatientsByTopDoctors = async (rating) => {
  let apiUrl = BASE_URL + GET_PATIENTS_BY_TOP_DOC_URL + "?rating=" + rating;
  try {
    const response = await fetch(apiUrl, {
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

export const getAdminStats = async () => {
  let apiUrl = BASE_URL + GET_ADMIN_STATS_URL;
  try {
    const response = await fetch(apiUrl, {
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

export const getPatientHeatMap = async (startTime, endTime, searchStr) => {
  let requestBody = {
    startTime: startTime,
    endTime: endTime,
    allergyPattern: searchStr,
  }
  let apiUrl = BASE_URL + GET_PATIENT_HEAT_MAP;

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
    console.log("AdminLogin successful:", data);
    return data; // Return data if needed
  } catch (error) {
    console.error("Error during login:", error);
    throw error; // Rethrow the error for further handling if needed
  }
};