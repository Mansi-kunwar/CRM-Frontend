import React, { useState, useEffect } from 'react';
import {
    Box, Container, TextField, Typography, FormControl, InputLabel,
    Select, MenuItem, Button, Snackbar, IconButton, Grid, Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const servicesList = [
    'VPS Server', 'Hosting Services', 'ITSM', 'Antivirus', 'VEEAM',
    'Data Backup/DR Services', 'E-Mailing/M365/Google Workspace', 'Tally Shared Cloud',
    'G Suite/M365', 'Managed Services', 'DLP', 'C Panel Servers',
    'Rental Services', 'SAAS Based Licences', 'AWS/Azure Public Cloud'
];

export default function SalesForm() {
    const [companyOptions, setCompanyOptions] = useState([]);
    const [formData, setFormData] = useState({
        company: null,
        customerName: '',
        email: '',
        mobile: '',
        address: '',
        serviceCommitments: '',
        demoStatus: '',
        backup: '',
        filledBy: '',
    });
    const [isExisting, setIsExisting] = useState(false);
    const [existingServices, setExistingServices] = useState([]);
    const [newService, setNewService] = useState({
        serviceName: '', cost: '', billingInstruction: '', billingDate: '',
    });
    const [newServices, setNewServices] = useState([]);
    const [totalNewCost, setTotalNewCost] = useState('0.00');
    const [snackbar, setSnackbar] = useState({
        open: false, message: '', severity: 'success'
    });

    useEffect(() => {
        const sum = newServices.reduce((acc, s) => acc + Number(s.cost), 0);
        setTotalNewCost(sum.toFixed(2));
    }, [newServices]);

    // Fetch matching companies
    const fetchCompanies = async (input) => {
        try {
            const res = await axios.get('/api/company', { params: { q: input } });
            setCompanyOptions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // When selecting a company via dropdown
    const handleCompanySelect = (e, company) => {
        if (company) {
            setIsExisting(true);
            setFormData(prev => ({
                ...prev,
                company: company._id,
                customerName: company.customerName || '',
                email: company.email || '',
                mobile: company.mobile || '',
                address: company.address || '',
            }));
            // Fetch its services
            axios.get(`/api/company/${encodeURIComponent(company.companyName)}`)
                .then(res => {
                    setExistingServices(res.data.company.services || []);
                })
                .catch(() => setExistingServices([]));
        } else {
            // when user clears input
            setIsExisting(false);
            setExistingServices([]);
            setFormData({
                company: null,
                customerName: '',
                email: '',
                mobile: '',
                address: '',
                serviceCommitments: '',
                demoStatus: '',
                backup: '',
                filledBy: '',
            });
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleServiceChange = (e) => {
        setNewService(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const addService = () => {
        const { serviceName, cost, billingInstruction, billingDate } = newService;
        if (!serviceName || !cost || !billingInstruction || !billingDate) {
            return setSnackbar({
                open: true,
                message: 'Please complete all fields in new service.',
                severity: 'error'
            });
        }
        if (isNaN(Number(cost))) {
            return setSnackbar({
                open: true,
                message: 'Cost must be numeric.',
                severity: 'error'
            });
        }
        const duplicate = existingServices.some(s => s.serviceName === serviceName) ||
            newServices.some(s => s.serviceName === serviceName);
        if (duplicate) {
            return setSnackbar({
                open: true,
                message: 'Service already exists.',
                severity: 'error'
            });
        }
        setNewServices([...newServices, { ...newService }]);
        setNewService({ serviceName: '', cost: '', billingInstruction: '', billingDate: '' });
    };

    const removeService = (i) => {
        setNewServices(prev => prev.filter((_, idx) => idx !== i));
    };

    const handleSubmit = async () => {
        if (!isExisting && !formData.company) {
            return setSnackbar({
                open: true,
                message: 'Please select or enter a new company.',
                severity: 'error'
            });
        }
        if (newServices.length === 0) {
            return setSnackbar({
                open: true,
                message: 'Add at least one new service.',
                severity: 'error'
            });
        }
        const payload = {
            companyName: formData.companyName,
            companyId: formData.company,
            customerName: formData.customerName,
            email: formData.email,
            mobile: formData.mobile,
            address: formData.address,
            serviceCommitments: formData.serviceCommitments,
            demoStatus: formData.demoStatus,
            backup: formData.backup,
            filledBy: formData.filledBy,
            services: newServices,
        };
        try {
            const res = await axios.post('/api/sales', payload);
            if (res.status === 201) {
                setSnackbar({
                    open: true,
                    message: 'Sales form submitted successfully!',
                    severity: 'success'
                });
                // reset form
                setFormData({
                    company: null, companyName: '',
                    customerName: '', email: '', mobile: '', address: '',
                    serviceCommitments: '', demoStatus: '', backup: '', filledBy: ''
                });
                setIsExisting(false);
                setExistingServices([]);
                setNewServices([]);
            } else {
                throw new Error(res.data.error || 'Unknown error');
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message || 'Submission failed',
                severity: 'error'
            });
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                {isExisting ? 'Existing Customer' : 'New Customer'}
            </Typography>

            {/* Autocomplete Company Selector */}
            <Autocomplete
                options={companyOptions}
                getOptionLabel={(opt) => opt.companyName}
                onInputChange={(e, value) => fetchCompanies(value)}
                onChange={handleCompanySelect}
                freeSolo
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Company Name"
                        variant="outlined"
                        required
                    />
                }
                value={companyOptions.find(c => c._id === formData.company) || null}
            />

            {/* Show basic info for new company */}
            {!isExisting && (
                <>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Customer Name"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                </>
            )}

            {/* Required Fields */}
            <TextField
                fullWidth
                margin="normal"
                label="Service Commitments *"
                name="serviceCommitments"
                value={formData.serviceCommitments}
                onChange={handleInputChange}
                required
            />

            <FormControl fullWidth margin="normal">
                <InputLabel>Demo Status *</InputLabel>
                <Select
                    name="demoStatus"
                    value={formData.demoStatus}
                    onChange={handleInputChange}
                    required
                >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Backup *</InputLabel>
                <Select
                    name="backup"
                    value={formData.backup}
                    onChange={handleInputChange}
                    required
                >
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                margin="normal"
                label="Form Filled By *"
                name="filledBy"
                value={formData.filledBy}
                onChange={handleInputChange}
                required
            />

            {/* Read-only list of previously subscribed services */}
            {isExisting && existingServices.length > 0 && (
                <Box my={2} p={2} border="1px solid #ccc" borderRadius={1}>
                    <Typography variant="h6">Previously Subscribed Services</Typography>
                    {existingServices.map((svc, idx) => (
                        <Box key={idx} display="flex" justifyContent="space-between" mb={1}>
                            <Typography>{svc.serviceName}</Typography>
                            <Typography>
                                ₹{svc.cost} | {svc.billingInstruction} | {new Date(svc.billingDate).toLocaleDateString()}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Section to add new services */}
            <Box mt={4}>
                <Typography variant="h6">Add New Services</Typography>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Service Name *</InputLabel>
                            <Select
                                name="serviceName"
                                value={newService.serviceName}
                                onChange={handleServiceChange}
                            >
                                {servicesList.map((s, idx) => (
                                    <MenuItem key={idx} value={s}>{s}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Yearly Cost (₹)*"
                            name="cost"
                            value={newService.cost}
                            onChange={handleServiceChange}
                            type="number"
                            inputProps={{ min: 0 }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel>Billing Frequency *</InputLabel>
                            <Select
                                name="billingInstruction"
                                value={newService.billingInstruction}
                                onChange={handleServiceChange}
                                required
                            >
                                <MenuItem value="Monthly">Monthly</MenuItem>
                                <MenuItem value="Quarterly">Quarterly</MenuItem>
                                <MenuItem value="Half-Yearly">Half-Yearly</MenuItem>
                                <MenuItem value="Yearly">Yearly</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Billing Start Date *"
                            name="billingDate"
                            type="date"
                            value={newService.billingDate}
                            onChange={handleServiceChange}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Button fullWidth variant="contained" color="primary" onClick={addService}>
                            Add Service
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* List of new services */}
            {newServices.length > 0 && (
                <Box my={3}>
                    <Typography variant="subtitle1">New Services Added</Typography>
                    {newServices.map((svc, idx) => (
                        <Box
                            key={idx}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            p={1}
                            border="1px solid #ccc"
                            borderRadius={1}
                            mb={1}
                        >
                            <Typography>{svc.serviceName}</Typography>
                            <Typography>
                                ₹{svc.cost} | {svc.billingInstruction} | {svc.billingDate}
                            </Typography>
                            <IconButton color="error" onClick={() => removeService(idx)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Total cost of only new services */}
            <Box my={2}>
                <Typography variant="h6">
                    Total Yearly Cost (New Services): ₹{totalNewCost}
                </Typography>
            </Box>

            <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={handleSubmit}
                sx={{ mt: 2 }}
            >
                Submit Sales Form
            </Button>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
}
