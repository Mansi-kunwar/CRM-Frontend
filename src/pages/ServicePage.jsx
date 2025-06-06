import React, { useEffect, useState } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TextField, Button, CircularProgress
} from "@mui/material";
import axios from "axios";

const ServicePage = () => {
    const [companies, setCompanies] = useState([]);
    const [serviceDetails, setServiceDetails] = useState({});
    const [formInputs, setFormInputs] = useState({});
    const [saving, setSaving] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [companyRes, detailsRes] = await Promise.all([
                    axios.get("/api/company"),
                    axios.get("/api/service-details")
                ]);

                setCompanies(companyRes.data);

                const detailMap = {};
                detailsRes.data.forEach(detail => {
                    // Use companyId as key (ignore serviceName)
                    detailMap[detail.companyId] = detail;
                });

                setServiceDetails(detailMap);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (companyId, field, value) => {
        setFormInputs(prev => ({
            ...prev,
            [companyId]: {
                ...prev[companyId],
                [field]: value
            }
        }));
    };

    const handleSave = async (companyId) => {
        const input = formInputs[companyId];

        if (!input?.ip || !input?.config || !input?.portNo) {
            alert("All fields are required");
            return;
        }

        setSaving(prev => ({ ...prev, [companyId]: true }));

        try {
            await axios.post("/api/service-details", {
                companyId,
                serviceName: "default",  // or empty string ""
                ip: input.ip,
                config: input.config,
                portNo: input.portNo
            });

            alert("Details saved successfully!");

            setServiceDetails(prev => ({
                ...prev,
                [companyId]: {
                    companyId,
                    serviceName: "default",
                    ip: input.ip,
                    config: input.config,
                    portNo: input.portNo
                }
            }));

            setFormInputs(prev => {
                const updated = { ...prev };
                delete updated[companyId];
                return updated;
            });
        } catch (err) {
            console.error("Error saving details:", err);
            alert("Failed to save");
        } finally {
            setSaving(prev => ({ ...prev, [companyId]: false }));
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Company Technical Details
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Company</strong></TableCell>
                            <TableCell><strong>Customer Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>IP Address</strong></TableCell>
                            <TableCell><strong>Config</strong></TableCell>
                            <TableCell><strong>Port No</strong></TableCell>
                            <TableCell><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {companies.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No companies found.
                                </TableCell>
                            </TableRow>
                        )}

                        {companies.map(company => {
                            const detail = serviceDetails[company._id];
                            const form = formInputs[company._id] || {};

                            return (
                                <TableRow key={company._id}>
                                    <TableCell>{company.companyName}</TableCell>
                                    <TableCell>{company.customerName || "-"}</TableCell>
                                    <TableCell>{company.email || "-"}</TableCell>

                                    <TableCell>
                                        <TextField
                                            size="small"
                                            value={form.ip ?? detail?.ip ?? ""}
                                            onChange={e => handleChange(company._id, "ip", e.target.value)}
                                            placeholder="Enter IP"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            size="small"
                                            value={form.config ?? detail?.config ?? ""}
                                            onChange={e => handleChange(company._id, "config", e.target.value)}
                                            placeholder="Enter Config"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            size="small"
                                            value={form.portNo ?? detail?.portNo ?? ""}
                                            onChange={e => handleChange(company._id, "portNo", e.target.value)}
                                            placeholder="Enter Port"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleSave(company._id)}
                                            disabled={saving[company._id]}
                                        >
                                            {saving[company._id] ? "Saving..." : "Save"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ServicePage;
