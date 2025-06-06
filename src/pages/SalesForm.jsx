
// import {
//     Box,
//     Container,
//     TextField,
//     Typography,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Button,
//     Snackbar,
//     IconButton,
//     Grid
// } from '@mui/material';
// import { useState } from 'react';
// import DeleteIcon from '@mui/icons-material/Delete';

// const servicesList = [
//     'VPS Server', 'Hosting Services', 'ITSM', 'Antivirus', 'VEEAM',
//     'Data Backup/DR Services', 'E-Mailing/M365/Google Workspace', 'Tally Shared Cloud',
//     'G Suite/M365', 'Managed Services', 'DLP', 'C Panel Servers',
//     'Rental Services', 'SAAS Based Licences', 'AWS/Azure Public Cloud'
// ];

// export default function SalesForm() {
//     const [isExisting, setIsExisting] = useState(false);
//     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//     const initialForm = {
//         companyName: '',
//         customerName: '',
//         email: '',
//         mobile: '',
//         address: '',
//         referenceSource: '',
//         services: [],
//         billingDate: '',
//         yearlyCost: '',
//         serviceCommitments: '',
//         demoStatus: '',
//         backup: '',
//         filledBy: '',
//     };

//     const [formData, setFormData] = useState(initialForm);
//     const [newService, setNewService] = useState({ serviceName: '', cost: '', billingInstruction: '', billingDate: '' });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleServiceFieldChange = (e) => {
//         setNewService({ ...newService, [e.target.name]: e.target.value });
//     };

//     const addService = () => {
//         if (!newService.serviceName || !newService.cost || !newService.billingInstruction || !newService.billingDate) {
//             setSnackbar({ open: true, message: 'Please complete all service fields including billing date.', severity: 'error' });
//             return;
//         }

//         if (isNaN(Number(newService.cost))) {
//             setSnackbar({ open: true, message: 'Cost must be a number.', severity: 'error' });
//             return;
//         }

//         const updatedServices = [...formData.services, { ...newService }];
//         const updatedYearlyCost = updatedServices.reduce((sum, s) => sum + Number(s.cost), 0);

//         setFormData({
//             ...formData,
//             services: updatedServices,
//             yearlyCost: updatedYearlyCost.toFixed(2),
//         });

//         setNewService({ serviceName: '', cost: '', billingInstruction: '', billingDate: '' });
//     };

//     const removeService = (index) => {
//         const updated = [...formData.services];
//         updated.splice(index, 1);
//         const updatedYearlyCost = updated.reduce((sum, s) => sum + Number(s.cost), 0);
//         setFormData({ ...formData, services: updated, yearlyCost: updatedYearlyCost.toFixed(2) });
//     };

//     const fetchCompanyInfo = async () => {
//         if (!formData.companyName) {
//             setSnackbar({ open: true, message: 'Enter company name to check.', severity: 'error' });
//             return;
//         }

//         try {
//             const res = await fetch(`http://localhost:5000/api/sales/company/${formData.companyName}`);
//             const data = await res.json();

//             if (res.ok && data.company) {
//                 const companyData = {
//                     customerName: data.company.customerName || '',
//                     email: data.company.email || '',
//                     mobile: data.company.mobile || '',
//                     address: data.company.address || '',
//                     referenceSource: data.company.referenceSource || '',
//                     billingDate: data.company.billingDate || '',
//                     yearlyCost: data.company.yearlyCost || '',
//                     serviceCommitments: data.company.serviceCommitments || '',
//                     demoStatus: data.company.demoStatus || '',
//                     backup: data.company.backup || '',
//                     filledBy: data.company.filledBy || '',
//                 };

//                 setFormData((prev) => ({
//                     ...prev,
//                     ...companyData,
//                     services: [],
//                 }));

//                 setIsExisting(true);
//                 setSnackbar({ open: true, message: 'Company found. You can add more services.', severity: 'success' });
//             } else {
//                 setIsExisting(false);
//                 setSnackbar({ open: true, message: 'Company not found.', severity: 'info' });
//             }
//         } catch (error) {
//             setIsExisting(false);
//             setSnackbar({ open: true, message: 'Error fetching company.', severity: 'error' });
//         }
//     };

//     const handleSubmit = async () => {
//         if (formData.services.length === 0) {
//             setSnackbar({ open: true, message: "Please add at least one service.", severity: "error" });
//             return;
//         }

//         try {
//             const res = await fetch("http://localhost:5000/api/sales", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formData),
//             });

//             const data = await res.json();
//             if (res.ok) {
//                 setSnackbar({ open: true, message: "Sales form submitted successfully!", severity: "success" });
//                 setFormData(initialForm);
//                 setNewService({ serviceName: '', cost: '', billingInstruction: '', billingDate: '' });
//                 setIsExisting(false);
//             } else {
//                 setSnackbar({ open: true, message: data.error || "Submission failed", severity: "error" });
//             }
//         } catch (error) {
//             setSnackbar({ open: true, message: "Network error. Please try again.", severity: "error" });
//         }
//     };

//     return (
//         <Container maxWidth="md" sx={{ py: 4 }}>
//             <Typography variant="h4" gutterBottom>
//                 {isExisting ? 'Existing Customer' : 'New Customer (Sales Order Book)'}
//             </Typography>

//             <Box display="flex" gap={2} alignItems="center" mb={2}>
//                 <TextField
//                     label="Company Name"
//                     name="companyName"
//                     value={formData.companyName}
//                     onChange={handleChange}
//                     fullWidth
//                     required
//                 />
//                 <Button variant="outlined" onClick={fetchCompanyInfo}>
//                     Check Company
//                 </Button>
//             </Box>

//             {!isExisting && (
//                 <>
//                     <TextField fullWidth margin="normal" label="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
//                     <TextField fullWidth margin="normal" label="Email Address" name="email" value={formData.email} onChange={handleChange} />
//                     <TextField fullWidth margin="normal" label="Mobile No." name="mobile" value={formData.mobile} onChange={handleChange} required />
//                     <TextField fullWidth margin="normal" label="Address" name="address" value={formData.address} onChange={handleChange} required />
//                 </>
//             )}

//             <FormControl fullWidth margin="normal">
//                 <InputLabel>Reference Source</InputLabel>
//                 <Select name="referenceSource" value={formData.referenceSource} onChange={handleChange}>
//                     {['Google PPC', 'BNI', 'Client Reference', 'Indiamart', 'Existing Customer', 'E2E'].map((source, idx) => (
//                         <MenuItem key={idx} value={source}>{source}</MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>

//             <TextField fullWidth margin="normal" label="Billing Date" name="billingDate" type="date" InputLabelProps={{ shrink: true }} value={formData.billingDate} onChange={handleChange} required />

//             <Typography variant="h6" mt={3}>Add Services</Typography>

//             <Grid container spacing={2} mt={1}>
//                 <Grid item xs={3}>
//                     <FormControl fullWidth>
//                         <InputLabel>Service Name</InputLabel>
//                         <Select name="serviceName" value={newService.serviceName} onChange={handleServiceFieldChange}>
//                             {servicesList.map((service, idx) => (
//                                 <MenuItem key={idx} value={service}>{service}</MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>
//                 <Grid item xs={3}>
//                     <TextField label="Cost" name="cost" type="number" value={newService.cost} onChange={handleServiceFieldChange} fullWidth />
//                 </Grid>
//                 <Grid item xs={3}>
//                     <FormControl fullWidth>
//                         <InputLabel>Billing Instruction</InputLabel>
//                         <Select name="billingInstruction" value={newService.billingInstruction} onChange={handleServiceFieldChange}>
//                             {['Monthly', 'Quarterly', 'Half Yearly', 'Annually', 'Triennially'].map((option, idx) => (
//                                 <MenuItem key={idx} value={option}>{option}</MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>
//                 <Grid item xs={3}>
//                     <TextField
//                         name="billingDate"
//                         type="date"
//                         value={newService.billingDate}
//                         onChange={handleServiceFieldChange}
//                         label="Service Billing Date"
//                         InputLabelProps={{ shrink: true }}
//                         fullWidth
//                     />
//                 </Grid>
//             </Grid>

//             <Box mt={2}>
//                 <Button variant="outlined" onClick={addService}>Add Service</Button>
//             </Box>

//             {formData.services.map((service, index) => (
//                 <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mt={2} px={2} py={1} bgcolor="#f4f4f4" borderRadius={2}>
//                     <Typography>
//                         {service.serviceName} - ₹{service.cost} ({service.billingInstruction}, Billing: {service.billingDate})
//                     </Typography>
//                     <IconButton onClick={() => removeService(index)}><DeleteIcon /></IconButton>
//                 </Box>
//             ))}

//             <TextField fullWidth margin="normal" label="Total Yearly Cost" name="yearlyCost" value={formData.yearlyCost} onChange={handleChange} required />
//             <TextField fullWidth margin="normal" label="Service Commitments" name="serviceCommitments" value={formData.serviceCommitments} onChange={handleChange} required />

//             <FormControl fullWidth margin="normal">
//                 <InputLabel>Demo Status</InputLabel>
//                 <Select name="demoStatus" value={formData.demoStatus} onChange={handleChange} required>
//                     <MenuItem value="YES">YES</MenuItem>
//                     <MenuItem value="NO">NO</MenuItem>
//                 </Select>
//             </FormControl>

//             <FormControl fullWidth margin="normal">
//                 <InputLabel>Backup Required?</InputLabel>
//                 <Select name="backup" value={formData.backup} onChange={handleChange} required>
//                     <MenuItem value="Full">Full</MenuItem>
//                     <MenuItem value="Data Folders Only">Data Folders Only</MenuItem>
//                     <MenuItem value="Not required, Client will take ownself">Not required, Client will take ownself</MenuItem>
//                 </Select>
//             </FormControl>

//             <FormControl fullWidth margin="normal">
//                 <InputLabel>Form Filled By</InputLabel>
//                 <Select name="filledBy" value={formData.filledBy} onChange={handleChange} required>
//                     {['Dheeraj Gupta', 'Jasmeet Bajaj', 'Seema', 'Riya', 'Jessica'].map((name, idx) => (
//                         <MenuItem key={idx} value={name}>{name}</MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>

//             <Box textAlign="center" mt={3}>
//                 <Button variant="contained" size="large" onClick={handleSubmit}>
//                     Submit Form
//                 </Button>
//             </Box>

//             <Snackbar
//                 open={snackbar.open}
//                 onClose={() => setSnackbar({ ...snackbar, open: false })}
//                 autoHideDuration={4000}
//                 message={snackbar.message}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//             />
//         </Container>
//     );
// }


import {
    Box,
    Container,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Snackbar,
    IconButton,
    Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

const servicesList = [
    'VPS Server', 'Hosting Services', 'ITSM', 'Antivirus', 'VEEAM',
    'Data Backup/DR Services', 'E-Mailing/M365/Google Workspace', 'Tally Shared Cloud',
    'G Suite/M365', 'Managed Services', 'DLP', 'C Panel Servers',
    'Rental Services', 'SAAS Based Licences', 'AWS/Azure Public Cloud'
];

export default function SalesForm() {
    const [isExisting, setIsExisting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const initialForm = {
        companyName: '',
        customerName: '',
        email: '',
        mobile: '',
        address: '',
        referenceSource: '',
        serviceCommitments: '',
        demoStatus: '',
        backup: '',
        filledBy: '',
    };

    const [formData, setFormData] = useState(initialForm);

    // Existing services already bought by company (read-only)
    const [existingServices, setExistingServices] = useState([]);

    // New services to add
    const [newServices, setNewServices] = useState([]);

    // New service being added in the form inputs
    const [newService, setNewService] = useState({
        serviceName: '',
        cost: '',
        billingInstruction: '',
        billingDate: '',
    });

    // Calculate total cost = existing + new services
    const calculateTotalCost = () => {
        const existingCost = existingServices.reduce((sum, s) => sum + Number(s.cost), 0);
        const newCost = newServices.reduce((sum, s) => sum + Number(s.cost), 0);
        return (existingCost + newCost).toFixed(2);
    };

    const [totalYearlyCost, setTotalYearlyCost] = useState('0.00');

    useEffect(() => {
        setTotalYearlyCost(calculateTotalCost());
    }, [existingServices, newServices]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleServiceFieldChange = (e) => {
        setNewService({ ...newService, [e.target.name]: e.target.value });
    };

    const addService = () => {
        if (!newService.serviceName || !newService.cost || !newService.billingInstruction || !newService.billingDate) {
            setSnackbar({ open: true, message: 'Please complete all service fields including billing date.', severity: 'error' });
            return;
        }

        if (isNaN(Number(newService.cost))) {
            setSnackbar({ open: true, message: 'Cost must be a number.', severity: 'error' });
            return;
        }

        // Check if service already exists in existingServices or newServices (avoid duplicates)
        const serviceExists =
            existingServices.some(s => s.serviceName === newService.serviceName) ||
            newServices.some(s => s.serviceName === newService.serviceName);

        if (serviceExists) {
            setSnackbar({ open: true, message: 'Service already exists for this company.', severity: 'error' });
            return;
        }

        setNewServices([...newServices, { ...newService }]);
        setNewService({ serviceName: '', cost: '', billingInstruction: '', billingDate: '' });
    };

    const removeNewService = (index) => {
        const updated = [...newServices];
        updated.splice(index, 1);
        setNewServices(updated);
    };

    const fetchCompanyInfo = async () => {
        if (!formData.companyName) {
            setSnackbar({ open: true, message: 'Enter company name to check.', severity: 'error' });
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/sales/company/${formData.companyName}`);
            const data = await res.json();

            if (res.ok && data.company) {
                const companyData = {
                    customerName: data.company.customerName || '',
                    email: data.company.email || '',
                    mobile: data.company.mobile || '',
                    address: data.company.address || '',
                    referenceSource: data.company.referenceSource || '',
                    serviceCommitments: data.company.serviceCommitments || '',
                    demoStatus: data.company.demoStatus || '',
                    backup: data.company.backup || '',
                    filledBy: data.company.filledBy || '',
                };

                setFormData(companyData);
                setExistingServices(data.company.services || []); // load existing services

                setNewServices([]); // reset new services input

                setIsExisting(true);
                setSnackbar({ open: true, message: 'Company found. You can add more services.', severity: 'success' });
            } else {
                setIsExisting(false);
                setExistingServices([]);
                setNewServices([]);
                setFormData(initialForm);
                setFormData((prev) => ({ ...prev, companyName: formData.companyName }));
                setSnackbar({ open: true, message: 'Company not found.', severity: 'info' });
            }
        } catch (error) {
            setIsExisting(false);
            setSnackbar({ open: true, message: 'Error fetching company.', severity: 'error' });
        }
    };

    const handleSubmit = async () => {
        if (newServices.length === 0) {
            setSnackbar({ open: true, message: 'Please add at least one new service.', severity: 'error' });
            return;
        }

        // Prepare data to send
        // For existing company: send company info + new services only
        // For new company: send full form + all services (but here, all services are in newServices array)
        const payload = {
            ...formData,
            services: newServices,
        };

        try {
            const res = await fetch('http://localhost:5000/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setSnackbar({ open: true, message: 'Sales form submitted successfully!', severity: 'success' });
                setFormData(initialForm);
                setExistingServices([]);
                setNewServices([]);
                setIsExisting(false);
            } else {
                setSnackbar({ open: true, message: data.error || 'Submission failed', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Network error. Please try again.', severity: 'error' });
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                {isExisting ? 'Existing Customer' : 'New Customer (Sales Order Book)'}
            </Typography>

            <Box display="flex" gap={2} alignItems="center" mb={2}>
                <TextField
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={isExisting} // disable companyName editing if existing
                />
                <Button variant="outlined" onClick={fetchCompanyInfo} disabled={isExisting}>
                    Check Company
                </Button>
            </Box>

            {!isExisting && (
                <>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Customer Name"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Mobile No."
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </>
            )}

            <FormControl fullWidth margin="normal">
                <InputLabel>Reference Source</InputLabel>
                <Select name="referenceSource" value={formData.referenceSource} onChange={handleChange}>
                    {['Google PPC', 'BNI', 'Client Reference', 'Indiamart', 'Existing Customer', 'E2E'].map(
                        (source, idx) => (
                            <MenuItem key={idx} value={source}>
                                {source}
                            </MenuItem>
                        )
                    )}
                </Select>
            </FormControl>

            <TextField
                fullWidth
                margin="normal"
                label="Service Commitments"
                name="serviceCommitments"
                value={formData.serviceCommitments}
                onChange={handleChange}
                required
            />

            <FormControl fullWidth margin="normal">
                <InputLabel>Demo Status</InputLabel>
                <Select name="demoStatus" value={formData.demoStatus} onChange={handleChange} required>
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Backup</InputLabel>
                <Select name="backup" value={formData.backup} onChange={handleChange} required>
                    <MenuItem value="YES">YES</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                margin="normal"
                label="Form Filled By"
                name="filledBy"
                value={formData.filledBy}
                onChange={handleChange}
                required
            />

            {/* Existing Services List (Read-only) */}
            {isExisting && existingServices.length > 0 && (
                <Box mt={4} mb={2}>
                    <Typography variant="h6">Existing Services for {formData.companyName}</Typography>
                    <Box sx={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
                        {existingServices.map((service, index) => (
                            <Box
                                key={index}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={1}
                            >
                                <Typography>{service.serviceName}</Typography>
                                <Typography>
                                    Cost: ₹{service.cost} | Billing: {service.billingInstruction} | Date: {service.billingDate}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* New Services to Add */}
            <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                    Add New Services
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Service Name</InputLabel>
                            <Select
                                name="serviceName"
                                value={newService.serviceName}
                                onChange={handleServiceFieldChange}
                            >
                                {servicesList.map((service, idx) => (
                                    <MenuItem key={idx} value={service}>
                                        {service}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Yearly Cost (₹)"
                            name="cost"
                            value={newService.cost}
                            onChange={handleServiceFieldChange}
                            type="number"
                            inputProps={{ min: 0 }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel>Billing Instruction</InputLabel>
                            <Select
                                name="billingInstruction"
                                value={newService.billingInstruction}
                                onChange={handleServiceFieldChange}
                            >
                                {['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'].map((option, idx) => (
                                    <MenuItem key={idx} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Billing Date"
                            name="billingDate"
                            value={newService.billingDate}
                            onChange={handleServiceFieldChange}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} display="flex" alignItems="center">
                        <Button variant="contained" color="primary" onClick={addService} fullWidth>
                            Add Service
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* New services list with remove option */}
            {newServices.length > 0 && (
                <Box mt={3}>
                    <Typography variant="subtitle1">New Services to Add</Typography>
                    {newServices.map((service, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                            p={1}
                            border="1px solid #ccc"
                            borderRadius={1}
                        >
                            <Typography>{service.serviceName}</Typography>
                            <Typography>
                                Cost: ₹{service.cost} | Billing: {service.billingInstruction} | Date: {service.billingDate}
                            </Typography>
                            <IconButton onClick={() => removeNewService(index)} size="small" color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Total Yearly Cost */}
            <Box mt={3}>
                <Typography variant="h6">
                    Total Yearly Cost (Existing + New): ₹{totalYearlyCost}
                </Typography>
            </Box>

            <Box mt={4}>
                <Button variant="contained" color="success" fullWidth onClick={handleSubmit}>
                    Submit Sales Form
                </Button>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
}
