import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import React, {useEffect, useState} from "react";
import {Autocomplete, Box, Button, TextField, Typography} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {getPatientHeatMap} from "../apis/AdminApis";

const HeatmapLayer = ({ data }) => {
    const map = useMap();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const heatLayer = L.heatLayer(
            data.map((point) => [point.lat, point.lng, point.count * 1 || 1]),
            { radius: 20, blur: 10, maxZoom: 20 }
        );

        heatLayer.addTo(map);

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [data, map]);

    return null;
};



function PatientHeatMap() {
    const [heatmapData, setHeatmapData] = useState([]);
    const [startDate,setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null);
    const conditionsList = ["Cancer", "Obesity", "Diabetes", "Asthma", "Hypertension", "Arthritis"]
    const [selectedCondition,setSelectedCondition] = useState("Cancer");

    const getPatientHeatMapData = async () => {
        try {
            const startParam = startDate.format('YYYY-MM-DD HH:mm:ss');
            const endParam = endDate.format('YYYY-MM-DD HH:mm:ss');
            const response = await getPatientHeatMap(startParam, endParam, selectedCondition);
            let tempHeatMap = []
            if (response?.responseObject?.length > 0 && response?.responseObject[0]?.length > 0) {
                response?.responseObject[0].map((d) => {
                    tempHeatMap.push({
                        lng: d?.xCoordinates,
                        lat: d?.yCoordinates,
                        count: d?.patient_count
                    });
                });
            }
            setHeatmapData(tempHeatMap);
        } catch (error) {
            console.log("error: ",error)
        }
    }

    return (
        <div style={{marginLeft: "3rem", marginRight: "3rem"}}>
            <Box
                display="block"
                textAlign="left"
                mb={4} // Add margin-bottom to separate sections
            >
                <Typography variant="h4" style={{ marginBottom: "2rem" }}>
                    View Patient's Conditions map
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
                {/* Patient Condition */}
                <Box>
                    <Typography variant="h6" style={{ marginBottom: "0.5rem" }}>
                        Select Patient Condition:
                    </Typography>
                </Box>
                <Box>
                    <Autocomplete
                        options={conditionsList}
                        getOptionLabel={(option) => option}
                        value={selectedCondition}
                        onChange={(event, newValue) => setSelectedCondition(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Condition" variant="outlined" style={{width: "11rem"}} />
                        )}
                    />
                </Box>
                {/* Start Date */}
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Box>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" />
                            )}
                        />
                    </Box>

                    {/* End Date */}
                    <Box>
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" />
                            )}
                            disabled={!startDate} // Prevent selecting end date before start date
                        />
                    </Box>
                </LocalizationProvider>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => getPatientHeatMapData()}
                        sx={{
                            textTransform: "none", // Keeps the button text from being all uppercase
                            fontWeight: "bold",
                            padding: 2,
                        }}
                    >
                        Search
                    </Button>
                </Box>
            </Box>
            <div style={{height: "100vh", width: "100vh", marginTop: "1rem", marginBottom: "2rem"}}>
                <MapContainer
                    center={[37.0902, -95.7129]} // Center of US
                    zoom={4}
                    style={{height: "100%", width: "100%"}}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    <HeatmapLayer data={heatmapData}/>
                </MapContainer>
            </div>
        </div>);
}

export default PatientHeatMap;