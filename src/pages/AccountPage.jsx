import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    TextField,
    Box,
} from "@mui/material";

const AccountPage = () => {
    const [billingData, setBillingData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const response = await axios.get("/api/billing");
                const flattenedData = [];

                response.data.forEach((billing) => {
                    billing.services.forEach((service, index) => {
                        flattenedData.push({
                            id: `${billing._id}-${index}`,
                            billingId: billing._id,
                            companyName: billing.companyName,
                            serviceName: service.serviceName,
                            billingInstruction: service.billingInstruction,
                            cost: service.cost,
                            billingDate: new Date(service.nextBillingDate),
                            status: service.status || "Pending",
                            serviceIndex: index,
                        });
                    });
                });

                setBillingData(flattenedData);
                setFilteredData(flattenedData);
            } catch (err) {
                console.error("Failed to fetch billing data", err);
            }
        };

        fetchBillingData();
    }, []);

    const handleFilter = () => {
        if (!fromDate || !toDate) return;

        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // Include entire 'to' day

        const filtered = billingData.filter((item) => {
            const billingDate = new Date(item.billingDate);
            return billingDate >= from && billingDate <= to;
        });

        setFilteredData(filtered);
    };

    const formatDate = (dateObj) =>
        new Date(dateObj).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    return (
        <div style={{ padding: "2rem" }}>
            <Typography variant="h4" gutterBottom>
                Accounts - Billing Overview
            </Typography>

            <Box display="flex" gap={2} mb={3}>
                <TextField
                    type="date"
                    label="From"
                    InputLabelProps={{ shrink: true }}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
                <TextField
                    type="date"
                    label="To"
                    InputLabelProps={{ shrink: true }}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilter}
                >
                    Filter
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead style={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                            <TableCell>Company Name</TableCell>
                            <TableCell>Service</TableCell>
                            <TableCell>Billing Instruction</TableCell>
                            <TableCell>Cost</TableCell>
                            <TableCell>Billing Date</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.companyName}</TableCell>
                                <TableCell>{row.serviceName}</TableCell>
                                <TableCell>{row.billingInstruction}</TableCell>
                                <TableCell>₹{row.cost}</TableCell>
                                <TableCell>{formatDate(row.billingDate)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        style={{
                                            backgroundColor:
                                                row.status === "Paid" ? "green" : "red",
                                            color: "white",
                                            cursor: "default",
                                            pointerEvents: "none",
                                        }}
                                    >
                                        {row.status}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AccountPage;
