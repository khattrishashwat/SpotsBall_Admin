import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import Loader from "../../components/loader/Loader";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [pointerEvents, setPointerEvents] = useState("");

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
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
      login(values);
      setLoading(true);
    },
  });

  const login = async (userInfo) => {
    try {
      const res = await httpClient.post("admin/auth/login", userInfo);
      console.log("login => ", res);

      // Check if the token is directly in the response (adjust as needed)
      const token = res.data?.data?.token || res.data.token || res.token;

      if (token) {
        localStorage.setItem("token", token);
        setApiSuccess(true);
        setApiError(false);
        setAlertMessage("Logged In Successfully");
        setCloseSnakeBar(true);
        navigate("/dashboard");
      } else {
        throw new Error("Token not found in response.");
      }
    } catch (error) {
      setLoading(false);
      setPointerEvents("");
      setOpacity(1);
      setApiError(true);
      setApiSuccess(false);

      // Customize the error message
      const errorMessage =
        error.response?.data?.message || "Invalid Credentials";
      setAlertMessage(errorMessage);
      setCloseSnakeBar(true);
    }
  };

  return (
    <>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <PageTitle title={"Login"} />
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
                      open={closeSnakeBar}
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
                            onClick={() => setCloseSnakeBar(false)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </React.Fragment>
                      }
                    />

                    <CForm onSubmit={loginForm.handleSubmit}>
                      <img
                        src={`${process.env.PUBLIC_URL}/images/logo.png`}
                        alt="Logo"
                        style={{ width: "80%", marginBottom: "1rem" }}
                      />
                      <p className="text-medium-emphasis">
                        Sign In to your account
                      </p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <span>
                            <i className="bi bi-envelope"></i>
                          </span>
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Email"
                          name="email"
                          id="email"
                          onChange={loginForm.handleChange}
                          value={loginForm.values.email}
                          onClick={() => setCloseSnakeBar(false)}
                          onKeyDown={(e) => {
                            if (!loginForm.values.email && e.key === " ") {
                              e.preventDefault();
                            }
                          }}
                        />
                        {loginForm.errors.email && loginForm.touched.email && (
                          <div className="invalid-feedback">
                            {loginForm.errors.email}
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
                          onClick={() => setCloseSnakeBar(false)}
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
                            Login
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-right">
                          <Link
                            to={"/auth/forgot"}
                            style={{ paddingLeft: "81px", paddingRight: "0" }}
                          >
                            Forgot Password?
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
    </>
  );
};

export default Login;
