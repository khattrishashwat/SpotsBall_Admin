import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useFormik } from "formik";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../util/HttpClient";
import Loader from "../../components/loader/Loader";

const Forgot = () => {
  const [alertMessage, setAlertMessage] = useState();
  const [apiSuccess, setApiSuccess] = useState("");
  const [apiError, setApiError] = useState("");
  const [openSnakeBar, setOpenSnakeBar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [pointerEvents, setPointerEvents] = useState("");
  const [openOtpDialog, setOpenOtpDialog] = useState(false); // State for OTP dialog
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
  });

  const loginForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setPointerEvents("none");
      setOpacity(0.3);

      window.localStorage.setItem("email", values.email);

      setTimeout(() => {
        localStorage.removeItem("email");
      }, 500000); // after 5 minutes, the email will be removed from local storage

      sendOTP(values.email);
      setLoading(true);
    },
  });

  const sendOTP = (email) => {
    httpClient
      .post("admin/auth/send-otp", { email })
      .then((res) => {
        if (res) {
          window.localStorage.setItem("token", res.data.data.token);

          setApiError(false);
          setLoading(false);
          setPointerEvents("");
          setOpacity(1);
          setAlertMessage("OTP sent to Your Email");
          setApiSuccess(true);
          setOpenSnakeBar(true);
          setOpenOtpDialog(true); // Open the OTP dialog
        }
      })
      .catch((error) => {
        setApiSuccess(false);
        setLoading(false);
        setPointerEvents("");
        setOpacity(1);
        setApiError(true);
        if (error.response && error.response.data) {
          setAlertMessage(error.response.data.message);
        } else {
          setAlertMessage("Something went wrong!");
        }
        setOpenSnakeBar(true);
      });
  };

  const verifyOTP = () => {
    httpClient
      .post("admin/auth/submit-otp", { otp })
      .then((res) => {
        if (res) {
          setOpenOtpDialog(false);
          setAlertMessage("OTP Verified Successfully");
          setApiSuccess(true);
          setOpenSnakeBar(true);
          navigate("/auth/reset");
        }
      })
      .catch((error) => {
        setAlertMessage("Invalid OTP");
        setApiSuccess(false);
        setOpenSnakeBar(true);
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      {loading && <Loader />}
      <CContainer
        style={{ opacity: `${opacity}`, pointerEvents: `${pointerEvents}` }}
      >
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Snackbar
                    open={openSnakeBar}
                    autoHideDuration={1000}
                    message={alertMessage}
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
                  <CForm onSubmit={loginForm.handleSubmit}>
                    <h1>Forgot Password</h1>
                    <p className="text-medium-emphasis">
                      Enter email to get OTP
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <span>
                          <i className="bi bi-envelope"></i>
                        </span>
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        onChange={loginForm.handleChange}
                        onClick={() => setOpenSnakeBar(false)}
                        value={loginForm.values.email}
                      />
                      {loginForm.errors.email && loginForm.touched.email && (
                        <div className="invalid-feedback">
                          {loginForm.errors.email}
                        </div>
                      )}
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          OTP
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link
                          to={"/auth/login"}
                          style={{ paddingLeft: "81px", paddingRight: "0" }}
                        >
                          Back to login
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>

      {/* OTP Dialog */}
      <Dialog
        open={openOtpDialog}
        onClose={() => {}}
        disableBackdropClick // Prevent closing when clicking outside
        disableEscapeKeyDown // Prevent closing when pressing escape
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialogTitle-root": {
            fontWeight: "bold",
            fontSize: "1.2rem",
            padding: "16px 24px",
          },
          "& .MuiDialogContent-root": {
            padding: "16px 24px",
          },
          "& .MuiButton-root": {
            textTransform: "none",
            padding: "8px 20px",
            fontSize: "0.9rem",
          },
        }}
      >
        <DialogTitle>Verify OTP</DialogTitle>
        <DialogContent>
          <span>Enter OTP </span>
          <TextField
            // label="Enter OTP"
            type="text"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="dense"
            error={otp === "" && apiError} // Highlight if OTP is empty when submitting
            helperText={otp === "" && apiError ? "OTP is required" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOtpDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={verifyOTP}
            color="primary"
            disabled={otp === ""} // Disable the Verify button if OTP is empty
          >
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Forgot;
