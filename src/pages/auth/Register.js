import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
import PageTitle from "../common/PageTitle";
import { useFormik } from "formik";
import httpClient from "../../util/HttpClient";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [openSnakeBar, setOpenSnakeBar] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    mobile: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required"),
    mobile: Yup.number().required("Mobile is required"),
    password: Yup.string().required("Password is required"),
  });
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const loginForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      register(values);
      setOpenSnakeBar(true);
    },
  });

  //storing new user data in database
  const register = async (userInfo) => {
    httpClient
      .post("/register", userInfo)
      .then((res) => {
        if (res.data && res.data.success) {
          setApiSuccess(true);
          setApiError(false);
          setAlertMessage("Registered Successfully");
          navigate("/auth/login");
        }
        setAlertMessage("");
      })
      .catch((error) => {
        // console.log(error.response.data.message);
        setApiError(true);
        setApiSuccess(false);
        if (error.response && error.response.data) {
          setAlertMessage(error.response.data.message);
        }
        setAlertMessage("Something went wrong!");
      });
  };

  return (
    <>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <PageTitle title={"Register"} />
        <CContainer>
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
                          ? { backgroundColor: "green" }
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
                      <h1>Register</h1>
                      <p className="text-medium-emphasis">Create new account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <i className="bi bi-person"></i>
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Name"
                          name="name"
                          id="name"
                          onChange={loginForm.handleChange}
                          value={loginForm.values.name}
                          onClick={() => setOpenSnakeBar(false)}
                        />
                        {loginForm.errors.name && loginForm.touched.name && (
                          <div className="invalid-feedback">
                            {loginForm.errors.name}
                          </div>
                        )}
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <span>
                            <i className="bi bi-envelope"></i>
                          </span>
                        </CInputGroupText>
                        <CFormInput
                          type="email"
                          placeholder="Email"
                          name="email"
                          id="email"
                          onChange={loginForm.handleChange}
                          value={loginForm.values.email}
                          onClick={() => setOpenSnakeBar(false)}
                        />
                        {loginForm.errors.email && loginForm.touched.email && (
                          <div className="invalid-feedback">
                            {loginForm.errors.email}
                          </div>
                        )}
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <span>
                            <i className="bi bi-phone"></i>
                          </span>
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Mobile"
                          type="Number"
                          name="mobile"
                          id="mobile"
                          onChange={loginForm.handleChange}
                          value={loginForm.values.mobile}
                          onClick={() => setOpenSnakeBar(false)}
                        />
                        {loginForm.errors.mobile &&
                          loginForm.touched.mobile && (
                            <div className="invalid-feedback">
                              {loginForm.errors.mobile}
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
                          placeholder="Password"
                          autoComplete="current-password"
                          name="password"
                          id="password"
                          onChange={loginForm.handleChange}
                          value={loginForm.values.password}
                          onClick={() => setOpenSnakeBar(false)}
                        />
                        {loginForm.errors.password &&
                          loginForm.touched.password && (
                            <div className="invalid-feedback">
                              {loginForm.errors.password}
                            </div>
                          )}
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton
                            type="submit"
                            color="primary"
                            className="px-4"
                          >
                            Register
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
    </>
  );
};

export default Register;
