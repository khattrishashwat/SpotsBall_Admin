
import React, { useState, useRef } from 'react';
import { Container, Typography } from '@mui/material';
import { useFormik } from 'formik';
import httpClient from '../../util/HttpClient';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PhoneNumberForm = () => {
    const [CountyCode, setCountyCode] = useState();
    const [openSnakeBar, setOpenSnakeBar] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [apiSuccess, setApiSuccess] = useState("");
    const [apiError, setApiError] = useState("");

    const phoneinputRef = useRef();

    // Initial values for Formik
    const initialValues = {
        phone: CountyCode,
    };

    // Function to handle form submission
    const handleSubmit = (values, { resetForm }) => {
        console.log('Phone Number:', values.phone);
        httpClient
            .delete('/api/v1/user/delete-user', { phone: values.phone })
            .then((res) => {
                setApiSuccess(true)
                setAlertMessage(res.data?.message);
                setOpenSnakeBar(true);
                setApiError(false)
                console.log('User deleted successfully:', res.data);
                resetForm(); // Reset the form after successful submission
            })
            .catch((err) => {
                setApiError(true)
                setAlertMessage(err?.response?.data.message);
                setOpenSnakeBar(true);
                setApiSuccess(false)
                console.log("eeeeeeeeeeeee", err)
                console.error('Error deleting user:', err.response ? err.response.data : err.message);
            });
    };


    const formik = useFormik({
        initialValues: { phone: '' },
        onSubmit: handleSubmit,
    });

    return (
        <div // Parent div to center the container
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh', // Full height to allow vertical centering
                backgroundColor: '#e0e0e0', // Background color for the entire screen
            }}
        >
            <Container
                maxWidth="xs" // Set the maxWidth to 'xs' to make the form smaller
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '50vh', // Ensure full height in case of smaller content
                    backgroundColor: '#f4f4f4',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center', // Center the text content
                }}
            >
                <Typography variant="h2" sx={{ marginBottom: '20px', fontWeight: "700", color: '#55679C' }}>
                    Twilio
                </Typography>
                <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: "500", color: '#333' }}>
                    Delete User Account
                </Typography>
                <Snackbar
                    open={openSnakeBar}
                    autoHideDuration={1000}
                    message={alertMessage}
                    color="red"
                    ContentProps={{
                        sx: apiSuccess
                            ? { backgroundColor: "blue" }
                            : { backgroundColor: "red" },
                    }}
                    anchorOrigin={{
                        horizontal: "right",
                        vertical: "bottom",
                    }}
                    action={
                        <React.Fragment>
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                sx={{ p: 0.5 }}
                                onClick={() => setOpenSnakeBar(false)}
                            >
                                <CloseIcon />
                            </IconButton>
                        </React.Fragment>
                    }
                />
                <form onSubmit={formik.handleSubmit}>
                    <PhoneInput
                        country={'us'}
                        value={formik.values.phone}
                        onChange={(phone) => {
                            setCountyCode(phone);
                            formik.setFieldValue('phone', phone); // Update Formik's state
                        }}
                        inputProps={{
                            name: 'phone', // Ensure the name prop is set
                        }}
                        inputStyle={{
                            border: '2px solid #4caf50', // Custom border style
                            padding: '10px', // Custom padding
                            fontSize: '16px', // Font size for input text
                            color: '#333', // Text color
                            borderRadius: '5px', // Rounded corners
                            width: '100%', // Full width of the input
                            marginBottom: '15px' // Margin below the input
                        }}
                    />
                    <button
                        type='submit'
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: "20px"
                        }}
                    >
                        Delete
                    </button>
                </form>
            </Container>
        </div>
    );
};

export default PhoneNumberForm;
