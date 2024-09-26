import React, { useState, useRef, useCallback } from "react";
import { Container, Typography, IconButton, Snackbar } from "@mui/material";
import { useFormik } from "formik";
import httpClient from "../../util/HttpClient";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CloseIcon from "@mui/icons-material/Close";

const PhoneNumberForm = () => {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [apiStatus, setApiStatus] = useState(""); // Consolidated API success/failure

  const phoneInputRef = useRef();

  // Function to handle form submission
  const handleSubmit = useCallback((values, { resetForm }) => {
    const updateInfo = { phone: values.phone };

    httpClient
      .delete("/api/v1/user/delete-user", { data: updateInfo }) // 'data' is required for DELETE request
      .then((res) => {
        setApiStatus("success");
        setAlertMessage(res.data?.message);
        setOpenSnackBar(true);
        resetForm(); // Reset form after successful submission
      })
      .catch((err) => {
        setApiStatus("error");
        setAlertMessage(err.response?.data?.message || "Error deleting user");
        setOpenSnackBar(true);
        console.error("Error deleting user:", err);
      });
  }, []);

  const formik = useFormik({
    initialValues: { phone: "" },
    onSubmit: handleSubmit,
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#e0e0e0",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          backgroundColor: "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{ marginBottom: "20px", fontWeight: "700", color: "#55679C" }}
        >
          Twilio
        </Typography>
        <Typography
          variant="h5"
          sx={{ marginBottom: "20px", fontWeight: "500", color: "#333" }}
        >
          Delete User Account
        </Typography>
        <Snackbar
          open={openSnackBar}
          autoHideDuration={3000}
          message={alertMessage}
          ContentProps={{
            sx:
              apiStatus === "success"
                ? { backgroundColor: "blue" }
                : { backgroundColor: "red" },
          }}
          anchorOrigin={{
            horizontal: "right",
            vertical: "bottom",
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={() => setOpenSnackBar(false)}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <form onSubmit={formik.handleSubmit}>
          <PhoneInput
            country={"us"}
            value={formik.values.phone}
            onChange={(phone) => formik.setFieldValue("phone", phone)}
            inputProps={{ name: "phone" }}
            inputStyle={{
              border: "2px solid #4caf50",
              padding: "10px",
              fontSize: "16px",
              color: "#333",
              borderRadius: "5px",
              width: "100%",
              marginBottom: "15px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
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
