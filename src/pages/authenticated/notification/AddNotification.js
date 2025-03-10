import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Country } from "country-state-city";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  message: Yup.string().required("Message is required"),
  country: Yup.string().required("Country is required"),
  recipient: Yup.array()
    .min(1, "At least one recipient type is required")
    .required("Recipient is required"),
});

function AddNotification() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            Back
          </Button>

          <Typography variant="h4" align="center" gutterBottom>
            Add New Notification
          </Typography>

          <Formik
            initialValues={{
              title: "",
              message: "",
              country: "",
              recipient: [],
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Form Data", values);
            }}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="title"
                      label="Title"
                      fullWidth
                      error={touched.title && !!errors.title}
                      helperText={touched.title && errors.title}
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
                        <MenuItem key={country.isoCode} value={country.name}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="message"
                      label="Message"
                      multiline
                      rows={4}
                      fullWidth
                      error={touched.message && !!errors.message}
                      helperText={touched.message && errors.message}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Send To:</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.recipient.includes("User")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFieldValue("recipient", [
                                ...values.recipient,
                                "User",
                              ]);
                            } else {
                              setFieldValue(
                                "recipient",
                                values.recipient.filter(
                                  (item) => item !== "User"
                                )
                              );
                            }
                          }}
                        />
                      }
                      label="User"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.recipient.includes("Admin")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFieldValue("recipient", [
                                ...values.recipient,
                                "Admin",
                              ]);
                            } else {
                              setFieldValue(
                                "recipient",
                                values.recipient.filter(
                                  (item) => item !== "Admin"
                                )
                              );
                            }
                          }}
                        />
                      }
                      label="Admin"
                    />
                    {touched.recipient && errors.recipient && (
                      <Typography color="error" variant="body2">
                        {errors.recipient}
                      </Typography>
                    )}
                  </Grid>

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

export default AddNotification;
