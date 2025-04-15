// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Container,
//   TextField,
//   Typography,
//   Grid,
//   MenuItem,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";
// import AppSidebar from "../../../components/AppSidebar";
// import AppHeader from "../../../components/AppHeader";
// import { useNavigate } from "react-router-dom";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
// import { useTranslation } from "react-i18next";

// import { Country } from "country-state-city";

// const validationSchema = Yup.object({
//   title: Yup.string().required("Title is required"),
//   message: Yup.string().required("Message is required"),
//   //   country: Yup.string().required("Country is required"),
//   //   recipient: Yup.array()
//   //     .min(1, "At least one recipient type is required")
//   //     .required("Recipient is required"),
// });

// function Notifications() {
//   const navigate = useNavigate();
//   //   const [countries, setCountries] = useState([]);

//   //   useEffect(() => {
//   //     setCountries(Country.getAllCountries());
//   //   }, []);
//   const { t } = useTranslation();

//   return (
//     <>
//       <AppSidebar />
//       <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
//         <AppHeader />
//         <Container maxWidth="md" sx={{ py: 4 }}>
//           {/* <Button
//             variant="contained"
//             color="secondary"
//             startIcon={<ArrowBackIcon />}
//             onClick={() => navigate(-1)}
//             sx={{ mb: 3 }}
//           >
//             Back
//           </Button> */}

//           <Typography variant="h4" align="center" gutterBottom>
//             {t("New Notification")}
//           </Typography>

//           <Formik
//             initialValues={{
//               title: "",
//               message: "",
//               //   country: "",
//               //   recipient: [],
//             }}
//             validationSchema={validationSchema}
//             onSubmit={(values) => {
//               console.log("Form Data", values);
//             }}
//           >
//             {({ values, setFieldValue, errors, touched }) => (
//               <Form>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12}>
//                     <Field
//                       as={TextField}
//                       name="title"
//                       label={t("Title")}
//                       fullWidth
//                       error={touched.title && !!errors.title}
//                       helperText={touched.title && errors.title}
//                     />
//                   </Grid>

//                   {/* <Grid item xs={12}>
//                     <Field
//                       as={TextField}
//                       name="country"
//                       label="Country"
//                       select
//                       fullWidth
//                       error={touched.country && !!errors.country}
//                       helperText={touched.country && errors.country}
//                     >
//                       {countries.map((country) => (
//                         <MenuItem key={country.isoCode} value={country.name}>
//                           {country.name}
//                         </MenuItem>
//                       ))}
//                     </Field>
//                   </Grid> */}

//                   <Grid item xs={12}>
//                     <Field
//                       as={TextField}
//                       name="message"
//                       label={t("Message")}
//                       multiline
//                       rows={4}
//                       fullWidth
//                       error={touched.message && !!errors.message}
//                       helperText={touched.message && errors.message}
//                     />
//                   </Grid>

//                   {/* <Grid item xs={12}>
//                     <Typography variant="subtitle1">Send To:</Typography>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={values.recipient.includes("User")}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setFieldValue("recipient", [
//                                 ...values.recipient,
//                                 "User",
//                               ]);
//                             } else {
//                               setFieldValue(
//                                 "recipient",
//                                 values.recipient.filter(
//                                   (item) => item !== "User"
//                                 )
//                               );
//                             }
//                           }}
//                         />
//                       }
//                       label="User"
//                     />
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={values.recipient.includes("Admin")}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setFieldValue("recipient", [
//                                 ...values.recipient,
//                                 "Admin",
//                               ]);
//                             } else {
//                               setFieldValue(
//                                 "recipient",
//                                 values.recipient.filter(
//                                   (item) => item !== "Admin"
//                                 )
//                               );
//                             }
//                           }}
//                         />
//                       }
//                       label="Admin"
//                     />
//                     {touched.recipient && errors.recipient && (
//                       <Typography color="error" variant="body2">
//                         {errors.recipient}
//                       </Typography>
//                     )}
//                   </Grid> */}

//                   <Grid item xs={12}>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       color="primary"
//                       fullWidth
//                     >
//                       {t("Submit")}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </Form>
//             )}
//           </Formik>
//         </Container>
//       </div>
//     </>
//   );
// }

// export default Notifications;

import { useEffect, useState } from "react";
import {
  Card,
  List,
  TextField,
  Button,
  Autocomplete,
  Chip,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { CSpinner } from "@coreui/react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
export default function NotificationSender() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [errors, setErrors] = useState({ title: "", message: "", date: "" });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, email: "mailto:user1@example.com" },
    { id: 2, email: "mailto:user2@example.com" },
    { id: 3, email: "mailto:user3@example.com" },
    { id: 4, email: "mailto:user4@example.com" },
    { id: 5, email: "mailto:user5@example.com" },
    { id: 6, email: "mailto:user6@example.com" },
  ]);

  const validateInputs = () => {
    let isValid = true;
    let errors = { title: "", message: "", date: "" };

    if (!title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!message.trim()) {
      errors.message = "Message is required";
      isValid = false;
    }

    if (!date) {
      errors.date = "Date and time are required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const sendIndividualNotification = () => {
    console.log("sendIndividual user list => ", selectedUsers);
    // if (!validateInputs() || selectedUsers.length === 0) {
    //   return;
    // }
    // setLoading(true);
    // httpClient
    //   .post(`/send-individual-notification`, {
    //     title,
    //     message,
    //     date,
    //     users: selectedUsers,
    //   })
    //   .then((res) => {
    //     console.log("Individual notification sent", res);
    //     setTitle("");
    //     setMessage("");
    //     setDate("");
    //     setSelectedUsers([]);
    //   })
    //   .catch((err) => {
    //     console.log("individual notification error => ", err);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "2rem",
          }}
        >
          <Card style={{ padding: "16px", width: "45%" }}>
            <h5>Send Notification To All Users</h5>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              error={!!errors.message}
              helperText={errors.message}
            />
            <TextField
              label="Schedule Notification Time"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendIndividualNotification}
              fullWidth
              disabled={loading}
              style={{
                marginBottom: "-6rem",
              }}
            >
              {loading ? <CSpinner size="sm" /> : "Send Notification"}
            </Button>
          </Card>

          <Card style={{ padding: "16px", width: "45%" }}>
            <h5>Send Notification To Individual Users</h5>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Users</InputLabel>
              <Select
                multiple
                value={selectedUsers}
                onChange={(event) => {
                  console.log("on select => ", event.target.value);
                  setSelectedUsers(event.target.value);
                }}
                renderValue={(selected) =>
                  selected.map((user) => user.email).join(", ")
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: users.length > 5 ? 200 : "auto", // Enables scroll if more than 5 users
                      overflowY: "auto",
                    },
                  },
                }}
              >
                {userList.map((user) => (
                  <MenuItem
                    key={user._id}
                    value={{
                      id: user._id,
                      email: user.email,
                      fullName: user.fullName,
                    }}
                  >
                    <Checkbox
                      checked={selectedUsers.some((u) => u.id === user._id)}
                    />
                    {user.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              {selectedUsers.map((user) => (
                <Chip
                  key={user.id}
                  label={user.email}
                  onDelete={() =>
                    setSelectedUsers(
                      selectedUsers.filter((u) => u.id !== user.id)
                    )
                  }
                />
              ))}
            </div>

            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              error={!!errors.message}
              helperText={errors.message}
            />
            <TextField
              label="Schedule Notification Time"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendIndividualNotification}
              fullWidth
              disabled={loading}
            >
              {loading ? <CSpinner size="sm" /> : "Send Notification"}
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
