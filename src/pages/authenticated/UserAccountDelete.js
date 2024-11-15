import React, { useState, useRef, useCallback } from "react";
import { Container, Typography, IconButton, Snackbar } from "@mui/material";
import { useFormik } from "formik";
import httpClient from "../../util/HttpClient";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CloseIcon from "@mui/icons-material/Close";
import { Placeholder } from 'rsuite';
import backgrounImage from "./../../assets/images/backgroundImage.png";
import Logo from "../../../src/components/logo.png";
import Loader from "../../components/loader/Loader";
import { Audio } from 'react-loader-spinner'

const PhoneNumberForm = () => {

    const [CountyCode, setCountyCode] = useState();
    const [openSnakeBar, setOpenSnakeBar] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [apiSuccess, setApiSuccess] = useState("");
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

   

    const phoneInputRef = useRef();

    // Function to handle form submission
    const handleSubmit = useCallback((values, { resetForm }) => {
        const updateInfo = { phone: values.phone };

        // Function to handle form submission
       
            console.log('Phone Number:', values.phone);
            setLoading(true);
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
                }).finally(() => {
                    setLoading(false); // Reset loading state after request completion
                });
        })
        const formik = useFormik({
            initialValues: { phone: "" },
            onSubmit: handleSubmit,
        });

        return (
            <div // Parent div to center the container
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh', 
                    backgroundImage: `url(${backgrounImage})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat', 
                    backgroundColor: '#e0e0e0', // 

                }}
            >
                {loading ? (<Loader />) : (
                    <Container
                        maxWidth="xs" 
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '35vh', 
                            backgroundColor: '#f4f4f4',
                            padding: '20px 20px',
                            borderRadius: '8px',
                            boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center', 
                            width: "350px",

                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <img
                                src={Logo}
                                alt="Logo"
                                style={{ width: '40px', height: '40px', backgroundColor: 'transparent', borderRadius: "50%" }}
                            />
                            <Typography variant="h4" sx={{
                                fontWeight: "700",
                                color: '#CB80AB',
                            }}>
                                SpotsBall Admin
                            </Typography>
                        </div>

                        <Typography variant="h5" sx={{
                            textAlign: "center",
                            fontSize: "20px",
                            textTransform: "capitalize",
                            fontWeight: " 500",
                            fontFamily: "'Roboto', sans-serif",
                            marginBottom: "15px",
                            color: "#6A6A6A",
                            arginLeft: "20px"

                        }}>
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
                        <form onSubmit={formik.handleSubmit} >

                            <PhoneInput

                                country={'us'}
                                value={formik.values.phone}
                                onChange={(phone) => {
                                    setCountyCode(phone);
                                    formik.setFieldValue('phone', phone);
                                }}

                                inputProps={{
                                    name: 'phone',
                                    placeholder: 'Phone Number'
                                }}

                                inputStyle={{
                                    // padding: '20px',
                                    fontSize: '12px',
                                    color: '#333',
                                    borderRadius: '10px',
                                    width: '280px',
                                    marginBottom: '10px',

                                }}
                            />
                            <button
                                type='submit'
                                style={{
                                    padding: '5px 30px',
                                    backgroundColor: '#ff5722',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginTop: "13px",
                                    transition: 'background-color 0.3s ease',
                                    fontStyle: "bold"
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#4caf50'} // Hover color
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#ff5722'}
                            >
                                Delete
                            </button>
                        </form>
                    </Container>
                )}
            </div >
        )
    


}

export default PhoneNumberForm;

