import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import PageTitle from "../common/PageTitle";
import { useFormik } from "formik";
import axios from "axios";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../util/HttpClient";
import Loader from "../../components/loader/Loader";

const Reset = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [openSnakeBar, setOpenSnakeBar] = useState(false);
  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(1);
  const [pointerEvents, setPointerEvents] = useState("");

  const initialValues = {
    resetOTP: "",
    new_password: "",
  };
  const validationSchema = Yup.object().shape({
    resetOTP: Yup.string().required("OTP is required"),
    new_password: Yup.string().required("New Password is required"),
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loginForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setPointerEvents("none");
      setOpacity(0.3);
      resetPassword(values);
      setLoading(true);
    },
  });

  const resetPassword = (values) => {
    httpClient
      .put("/password/reset", values)
      .then((res) => {
        if (res.data && res.data.success) {
          setLoading(false);
          setPointerEvents("");
          setOpacity(1);
          setAlertMessage("Password Reset Successfully");
          setApiSuccess(true);
          setApiError(false);
          setOpenSnakeBar(true);
          window.localStorage.removeItem("email");
          navigate("/auth/login");
        }
      })
      .catch((error) => {
        setLoading(false);
        setPointerEvents("");
        setOpacity(1);
        setApiError(true);
        setApiSuccess(false);
        setOpenSnakeBar(true);
        if (error.response && error.response.data) {
          setAlertMessage(error.response.data.message);
        }
        setAlertMessage("Something went wrong!");
      });
  };

  const resendOTP = () => {
    setPointerEvents("none");
    setOpacity(0.3);
    setLoading(true);
    // sendOTP();
    console.log(opacity, pointerEvents);
  };

  const sendOTP = () => {
    setPointerEvents("none");
    setOpacity(0.3);
    setLoading(true);
    const email = JSON.parse(window.localStorage.getItem("email"));
    httpClient
      .post("/password/forgot", email)
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          setPointerEvents("");
          setOpacity(1);
          setAlertMessage("OTP sent to Your Email");
          setApiSuccess(true);
          setApiError(false);
          setOpenSnakeBar(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setPointerEvents("");
        setOpacity(1);
        setAlertMessage(error.response.data.message);
        setApiError(true);
        setApiSuccess(false);
        setOpenSnakeBar(true);
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <PageTitle title={"Reset Password"} />
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
                    color="red"
                    ContentProps={{
                      sx: apiSuccess
                        ? { background: "green" }
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
                    <h1>Reset Password</h1>
                    <p className="text-medium-emphasis">
                      Enter details to reset your password
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <span>
                          <i className="bi bi-envelope"></i>
                        </span>
                      </CInputGroupText>
                      <CFormInput
                        // type="Number"
                        name="resetOTP"
                        id="resetOTP"
                        placeholder="OTP"
                        onChange={loginForm.handleChange}
                        value={loginForm.values.resetOTP}
                        onClick={() => setOpenSnakeBar(false)}
                      />
                      {loginForm.errors.resetOTP &&
                        loginForm.touched.resetOTP && (
                          <div className="invalid-feedback">
                            {loginForm.errors.resetOTP}
                          </div>
                        )}
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <span role="button" onClick={handleShowPassword}>
                          <i
                            className={
                              showPassword ? "bi bi-eye" : "bi bi-eye-slash"
                            }
                          ></i>
                        </span>
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        name="new_password"
                        id="new_password"
                        placeholder="New Password"
                        onChange={loginForm.handleChange}
                        value={loginForm.values.new_password}
                        onClick={() => setOpenSnakeBar(false)}
                      />
                      {loginForm.errors.new_password &&
                        loginForm.touched.new_password && (
                          <div className="invalid-feedback">
                            {loginForm.errors.new_password}
                          </div>
                        )}
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Reset
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" onClick={sendOTP}>
                          Resend OTP
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Reset;
