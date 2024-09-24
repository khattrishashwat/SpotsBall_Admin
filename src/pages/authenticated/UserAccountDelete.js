// import React, { useState,useRef } from 'react';
// import { Container, Typography, TextField, IconButton, Button, InputAdornment } from '@mui/material';
// import { Phone, Delete } from '@mui/icons-material';
// import useformik from 'formik';
// import httpClient from '../../util/HttpClient';
// import * as Yup from 'yup';
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'



// const PhoneNumberForm = () => {
//     // Validation schema using Yup
//     const [CountyCode,setCountyCode] =useState()
//     const phoneinputRef=useRef()
//     console.log("hhhhhh",phoneinputRef)
//     // const validationSchema = Yup.object({
//     //     phoneNumber: Yup.string()
//     //         .matches(/^[0-9]+$/, 'Phone number must be digits only')
//     //         .min(10, 'Phone number must be at least 10 digits')
//     //         .max(15, 'Phone number must be at most 15 digits')
//     //         .required('Phone number is required'),
//     // });

//     // const[state,setState]={}
//     // Initial values for Formik
//     const initialValues = {
//         phone: '',
//     };


//     const formik= useformik({

//         initialValues:{initialValues},
//         // validationSchema={validationSchema}
//         onSubmit:{handleSubmit}

//     })

//     // Function to handle form submission
//     const handleSubmit = (values, { resetForm }) => {
//         // Make an API request to the endpoint with the phone number
//         console.log("hhhhhh",values)
//         httpClient
//             .post('/api/v1/user/delete-user', { phone: values.phoneNumber })
//             .then((res) => {
//                 console.log('User deleted successfully:', res.data);
//                 resetForm(); // Reset the form after successful submission
//             })
//             .catch((err) => {
//                 console.error('Error deleting user:', err.response ? err.response.data : err.message);
//             });
//     };

//     // Function to handle delete button click
//     const handleDeleteClick = (setFieldValue) => {
//         // Make an API request to the endpoint to delete the user
//         httpClient
//             .delete('/api/v1/user/delete-user')
//             .then((res) => {
//                 console.log('User deleted successfully:', res.data);
//                 setFieldValue('phoneNumber', ''); // Clear the form field after successful deletion
//             })
//             .catch((err) => {
//                 console.error('Error deleting user:', err.response ? err.response.data : err.message);
//             });
//     };

//     return (
//         <Container
//             maxWidth="xs" // Set the maxWidth to 'xs' to make the form smaller
//             sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 minHeight: '50vh', // Use minHeight to ensure full height in case of smaller content
//                 backgroundColor: '#f4f4f4',
//                 padding: '20px',
//                 borderRadius: '8px',
//                 boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
//                 textAlign: 'center', // Center the text content
//             }}
//         >
//             <Typography variant="h5" sx={{ marginBottom: '20px', color: '#333' }}>
//                 User Account Delete
//             </Typography>
           
//             {/* <Formik

//                 initialValues={initialValues}
//                 // validationSchema={validationSchema}
//                 onSubmit={handleSubmit}
//             >
//                 {({ errors, touched, values, handleChange, setFieldValue }) => (
//                     <Form style={{ width: '100%' }}>
//                         <PhoneInput
//                          country={'us'}
//                          value={CountyCode}
//                          onChange={phone => setCountyCode({ phone })}
//                         >
//                         <Field
//                         ref={phoneinputRef}
//                             as={TextField}
//                             name="phoneNumber"
//                             variant="outlined"
//                             placeholder="Phone Number"
//                             fullWidth
//                             value={values.phoneNumber}
//                             onChange={handleChange}
//                             error={touched.phoneNumber && Boolean(errors.phoneNumber)}
//                             helperText={touched.phoneNumber && errors.phoneNumber}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Phone />
//                                     </InputAdornment>
//                                 ),
//                                 endAdornment: (
//                                     <InputAdornment position="end">
//                                         <IconButton
//                                             onClick={() => setFieldValue('phoneNumber', '')}
//                                             aria-label="delete"
//                                         >
//                                             <Delete />
//                                         </IconButton>
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={{
//                                 marginBottom: '20px',
//                                 backgroundColor: '#ffffff',
//                                 borderRadius: '5px',
//                             }}
//                         />
//                         </PhoneInput>

//                         <Button
//                             type="submit"
//                             variant="contained"
//                             color="error"
//                             startIcon={<Delete />}
//                             onClick={() => handleDeleteClick(setFieldValue)}
//                             fullWidth
//                             sx={{ backgroundColor: '#ff4b4b', '&:hover': { backgroundColor: '#ff3333' } }}
//                         >
//                             Delete
//                         </Button>
//                     </Form>
//                 )}
//             </Formik> */}


//                         <PhoneInput
//                          country={'us'}
//                          value={CountyCode}
//                          onChange={phone => setCountyCode({ phone })}
//                          />



//         </Container>
//     );
// };

// export default PhoneNumberForm;
