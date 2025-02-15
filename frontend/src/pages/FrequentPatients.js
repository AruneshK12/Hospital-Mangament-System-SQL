import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import TableLoadingSkeleton from "../components/TableLoadingSkeleton";
import {getFrequentCustomers} from "../apis/AdminApis";

function FrequentPatients() {
    const navigate = useNavigate();

    const [frequentCustList, setFrequentCustList] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const pageSize = 15;

    const getAllFrequentCustomers = async () => {
        setLoading(true);
        try {
            const response = await getFrequentCustomers();
            setTotalRows(response?.responseObject?.length);
            let tempCustomerMap = []
            let custId = 1;
            response?.responseObject?.map((customer) => {
                tempCustomerMap.push({
                    id: custId,
                    firstName: customer?.FirstName,
                    lastName: customer?.LastName,
                    Gender: customer?.Gender === 'M' ? 'Male' : customer?.Gender === 'F' ? 'Female' : 'Others',
                    // Email: customer?.Email,
                    // Phone: customer?.Phone,
                    TotalBookings: customer?.NumberOfBookings
                });
                custId = custId + 1;
            });
            setFrequentCustList(tempCustomerMap);
            setLoading(false);
        } catch (error) {
            console.log("error: ",error);
            setLoading(false);
        }
    }
    const [loading, setLoading] = useState(false);
    const columns = [
        { field: "id", headerName: "Serial no.", width: 200 },
        { field: "firstName", headerName: "First Name", width: 300 },
        { field: "lastName", headerName: "Last Name", width: 150 },
        { field: "Gender", headerName: "Gender", width: 300 },
        // { field: "Phone", headerName: "Phone", width: 300 },
        // { field: "Email", headerName: "Email", width: 150 },
        { field: "TotalBookings", headerName: "Total Bookings", width: 150 },

    ];

    useEffect(() => {
        getAllFrequentCustomers();
    },[]);



    return (
        <div style={{marginLeft: "3rem", marginRight: "3rem"}}>
            {/* Align welcome message at the start */}
            <Box
                display="block"
                textAlign="left"
                mb={2} // Add margin-bottom to separate sections
            >
                <Typography variant="h4" style={{ marginTop: "3rem", marginBottom: "1rem" }}>
                    View your Frequent Customers
                </Typography>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="left"
                justifyContent="center"
                height="400"
            >
                {loading ? (
                    <TableLoadingSkeleton />
                ) : (
                    <DataGrid
                        rows={frequentCustList}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: pageSize,
                                },
                            },
                        }}
                        pageSize={pageSize}
                        loading={loading}
                        rowCount={totalRows} // Total number of rows
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                )}
            </Box>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/admin-home-page')}
                sx={{
                    textTransform: "none", // Keeps the button text from being all uppercase
                    fontWeight: "bold",
                    marginTop: "10px",
                    padding: 2,
                }}
            >
                Go Back
            </Button>
        </div>);
}

export default FrequentPatients;