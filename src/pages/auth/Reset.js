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
import { useFormik } from "formik";
import httpClient from "../../util/HttpClient";
import Loader from "../../components/loader/Loader";

const Reset = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: localStorage.getItem("email") || "",
    new_password: "",
    confirm_password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    new_password: Yup.string().required("New Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      resetPassword(values);
    },
  });

  const resetPassword = (values) => {
    httpClient
      .post("admin/auth/reset-password", values)
      .then((res) => {
        setLoading(false);
        if (res.data?.success) {
          alert("Password reset successfull");
          localStorage.removeItem("email");
          navigate("/auth/login");
        }
      })
      .catch((error) => {
        setLoading(false);
        alert(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      {loading && <Loader />}
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={formik.handleSubmit}>
                    <h1>Reset Password</h1>
                    <p className="text-medium-emphasis">
                      Enter details to reset your password
                    </p>
                    {/* Email Field */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <i className="bi bi-envelope"></i>
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </CInputGroup>
                    {formik.errors.email && formik.touched.email && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.email}
                      </div>
                    )}

                    {/* New Password Field */}
                    <CInputGroup className="mb-3">
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
                        placeholder="New Password"
                        value={formik.values.new_password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </CInputGroup>
                    {formik.errors.new_password &&
                      formik.touched.new_password && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.new_password}
                        </div>
                      )}

                    {/* Confirm Password Field */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <span role="button" onClick={handleShowConfirmPassword}>
                          <i
                            className={
                              showConfirmPassword
                                ? "bi bi-eye"
                                : "bi bi-eye-slash"
                            }
                          ></i>
                        </span>
                      </CInputGroupText>
                      <CFormInput
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={formik.values.confirm_password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </CInputGroup>
                    {formik.errors.confirm_password &&
                      formik.touched.confirm_password && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.confirm_password}
                        </div>
                      )}

                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Reset
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
