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
import { IconButton, Snackbar } from "@mui/material";
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
      window.localStorage.setItem("email", JSON.stringify(values));
      setTimeout(() => {
        localStorage.removeItem("email");
      }, 500000); //after 5 minutes email will be removed from local storage
      sendOTP(values);
      setLoading(true);
    },
  });

  const sendOTP = (email) => {
    httpClient
      .post("/admin/forgot-password", {email})
      .then((res) => {
        if (res.data && res.data.success) {
          setApiError(false);
          setLoading(false);
          setPointerEvents("");
          setOpacity(1);
          setAlertMessage("Email sent to Your Email");
          setApiSuccess(true);
          setOpenSnakeBar(true);
          navigate("/auth/reset");
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
        }
        setAlertMessage("Something went wrong!");
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
                  {/* {loading && <Loader />} */}
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
                        // autoComplete="username"
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
                        <Link className="px-0" to={"/auth/login"}>
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
    </div>
  );
};

export default Forgot;
