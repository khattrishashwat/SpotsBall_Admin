import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  MenuItem,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Country } from "country-state-city";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  country: Yup.string().required("Country is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  profilePic: Yup.mixed().required("Profile picture is required"),
});

function AddAdmin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2, ml: 16 }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
          Back
        </Button>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Add New Admin
          </Typography>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              phoneNumber: "",
              country: "",
              password: "",
              profilePic: null,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Form Data", values);
            }}
          >
            {({ setFieldValue, errors, touched }) => (
              <Form>
                <Grid container spacing={2}>
                  {/* Left Side - Form Fields */}
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          name="firstName"
                          label="First Name"
                          fullWidth
                          error={touched.firstName && !!errors.firstName}
                          helperText={touched.firstName && errors.firstName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          as={TextField}
                          name="lastName"
                          label="Last Name"
                          fullWidth
                          error={touched.lastName && !!errors.lastName}
                          helperText={touched.lastName && errors.lastName}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          name="email"
                          label="Email"
                          type="email"
                          fullWidth
                          error={touched.email && !!errors.email}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          name="phoneNumber"
                          label="Phone Number"
                          fullWidth
                          error={touched.phoneNumber && !!errors.phoneNumber}
                          helperText={touched.phoneNumber && errors.phoneNumber}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          name="country"
                          label="Country"
                          select
                          fullWidth
                          error={touched.country && !!errors.country}
                          helperText={touched.country && errors.country}
                        >
                          {countries.map((country) => (
                            <MenuItem
                              key={country.isoCode}
                              value={country.name}
                            >
                              {country.name}
                            </MenuItem>
                          ))}
                        </Field>
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          name="password"
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          fullWidth
                          error={touched.password && !!errors.password}
                          helperText={touched.password && errors.password}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Right Side - Profile Picture */}
                  <Grid
                    item
                    xs={12}
                    md={4}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Avatar
                      src={preview}
                      alt="Preview"
                      sx={{ width: 150, height: 150, mb: 2 }}
                    />
                    <input
                      accept="image/*"
                      type="file"
                      id="profilePic"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const file = event.target.files[0];
                        setFieldValue("profilePic", file);
                        setPreview(URL.createObjectURL(file));
                      }}
                    />
                    <label htmlFor="profilePic">
                      <Button
                        variant="contained"
                        component="span"
                        color="primary"
                      >
                        Upload Profile Picture
                      </Button>
                    </label>
                    {touched.profilePic && errors.profilePic && (
                      <Typography color="error">{errors.profilePic}</Typography>
                    )}
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Container>
      </div>
    </>
  );
}

export default AddAdmin;
