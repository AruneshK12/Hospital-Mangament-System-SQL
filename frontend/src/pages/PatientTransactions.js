import React, {useEffect, useState} from "react";
import {
    Box,
    Button, Grid2,
    Typography,
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import TableLoadingSkeleton from "../components/TableLoadingSkeleton";
import {getFrequentCustomers} from "../apis/AdminApis";
import {getPatientTransactions} from "../apis/PatientApis";

function PatientTransactions() {
    const navigate = useNavigate();
    const {patientId} = useParams() || {};

    const [allTransactions, setAllTransactions] = useState([]);
    const [totalBilledAmount, setTotalBilledAmount] = useState(0);
    const [totalPaymentMade, setTotalPaymentMade] = useState(0);
    const [totalPaymentDue, setTotalPaymentDue] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const pageSize = 15;

    const getAllTransactions = async () => {
        setLoading(true);
        try {
            const response = await getPatientTransactions(patientId);
            setTotalRows(response?.responseObject?.length);
            let tempTransactions = []
            let totalBilledAmount = 0;
            let totalPaidAmount = 0;
            let totalPaymentDue = 0;
            response?.responseObject?.map((tr) => {
                let amt = Math.abs(Number(tr.Amount));
                if (tr.Mode === null) {
                    totalBilledAmount = totalBilledAmount + amt;
                } else {
                    totalPaidAmount = totalPaidAmount + amt;
                }
                tempTransactions.push({
                    id: tr.TransactionId,
                    type: tr.Mode === null ? 'Debit' : 'Credit',
                    amount: "$"+amt,
                    transactionType: tr.Type,
                    mode: tr.Mode === null ? '' : tr.Mode,
                });
            });
            totalPaymentDue = totalBilledAmount - totalPaidAmount;
            setTotalPaymentMade(Math.round(totalPaidAmount * 100)/100);
            setTotalPaymentDue(Math.round(totalPaymentDue * 100)/100);
            setTotalBilledAmount(Math.round(totalBilledAmount * 100)/100);
            setAllTransactions(tempTransactions);
            setLoading(false);
        } catch (error) {
            console.log("error: ",error);
            setLoading(false);
        }
    }
    const [loading, setLoading] = useState(false);
    const columns = [
        { field: "id", headerName: "Transaction no.", width: 200 },
        { field: "transactionType", headerName: "Transaction Type", width: 300 },
        { field: "type", headerName: "Type", width: 300 },
        { field: "amount", headerName: "Amount", width: 150 },
        { field: "mode", headerName: "Payment Mode", width: 150 },

    ];

    useEffect(() => {
        getAllTransactions();
    },[]);

    const [patientMetric,setPatientMetric] = useState([
        { label: "Total Billed Amount", value: totalBilledAmount },
        { label: "Total Payment Made", value: totalPaymentMade },
        { label: "Total Payment Due", value: totalPaymentDue },
    ]);

    useEffect(() => {
        setPatientMetric([
            { label: "Total Billed Amount", value: totalBilledAmount },
            { label: "Total Payment Made", value: totalPaymentMade },
            { label: "Total Payment Due", value: totalPaymentDue },
        ]);
    },[totalBilledAmount]);

    return (
        <div style={{marginLeft: "3rem", marginRight: "3rem"}}>
            {/* Align welcome message at the start */}
            <Box
                display="block"
                textAlign="left"
                mb={2} // Add margin-bottom to separate sections
            >
                <Typography variant="h4" style={{ marginTop: "3rem", marginBottom: "1rem" }}>
                    View your Transaction History
                </Typography>
                <Box sx={{ padding: 2 }}>
                    <Grid2 container spacing={2}>
                        {patientMetric.map((metric, index) => (
                            <Grid2 item xs={12} sm={4} key={index}>
                                <Box
                                    sx={{
                                        padding: 3,
                                        textAlign: "center",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        sx={{ fontWeight: "bold", color: "#3f51b5" }}
                                    >
                                        {metric.value}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {metric.label}
                                    </Typography>
                                </Box>
                            </Grid2>
                        ))}
                    </Grid2>
                </Box>
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
                        rows={allTransactions}
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
                onClick={() => navigate('/patient-home-page/' + patientId)}
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

export default PatientTransactions;