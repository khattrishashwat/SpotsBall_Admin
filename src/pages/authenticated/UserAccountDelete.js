import React, { useState,useRef } from 'react';
import { Container, Typography, TextField, IconButton, Button, InputAdornment } from '@mui/material';
import { Phone, Delete } from '@mui/icons-material';
import {useFormik} from 'formik';
import httpClient from '../../util/HttpClient';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'



const PhoneNumberForm = () => {
    // Validation schema using Yup
    const [CountyCode,setCountyCode] =useState()
    const phoneinputRef=useRef()
    // console.log("hhhhhh",phoneinputRef)
    // const validationSchema = Yup.object({
    //     phoneNumber: Yup.string()
    //         .matches(/^[0-9]+$/, 'Phone number must be digits only')
    //         .min(10, 'Phone number must be at least 10 digits')
    //         .max(15, 'Phone number must be at most 15 digits')
    //         .required('Phone number is required'),
    // });

    // const[state,setState]={}
    // Initial values for Formik
    const initialValues = {
        phone: CountyCode,
    };


    

    // Function to handle form submission
    const handleSubmit = (values, { resetForm }) => {
        console.log('hhhhhh------>',values.phone)
        // Make an API request to the endpoint with the phone number
        // console.log("hhhhhh",CountyCode)
        httpClient
            .post('/api/v1/user/delete-user', { phone: values.phone })
            .then((res) => {
                console.log('User deleted successfully:', res.data);
                resetForm(); // Reset the form after successful submission
            })
            .catch((err) => {
                console.error('Error deleting user:', err.response ? err.response.data : err.message);
            });
    };

    // Function to handle delete button click
    const handleDeleteClick = (setFieldValue) => {
        // Make an API request to the endpoint to delete the user
        httpClient
            .delete('/api/v1/user/delete-user')
            .then((res) => {
                console.log('User deleted successfully:', res.data);
                setFieldValue('phoneNumber', ''); // Clear the form field after successful deletion
            })
            .catch((err) => {
                console.error('Error deleting user:', err.response ? err.response.data : err.message);
            });
    };
    const formik= useFormik({

        initialValues:{initialValues},
        // validationSchema={validationSchema}
        onSubmit:handleSubmit

    })

    return (
        <Container
            maxWidth="xs" // Set the maxWidth to 'xs' to make the form smaller
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh', // Use minHeight to ensure full height in case of smaller content
                backgroundColor: '#f4f4f4',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
                textAlign: 'center', // Center the text content
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: '20px', color: '#333' }}>
                User Account Delete
            </Typography>
           
          
                    <form onSubmit={formik.handleSubmit}>
                        <PhoneInput
                         country={'us'}
                         value={formik.values.phone}
                         onChange={(phone) => {
                            setCountyCode(phone);
                            formik.setFieldValue('phone', phone); // Update Formik's state
                            formik.handleChange({ target: { name: 'phone', value: phone } }); 
                            console.log('Phone changed: ', phone);
                            // setCountyCode(phone);
                            // formik.setFieldValue('phone', phone);
                            // formik.setFieldValue('phone', phone);
                            
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
                         }}
                         />

                         <button type='submit'>Delete</button>

                    </form>
                  


        </Container>
    );
};

export default PhoneNumberForm;
