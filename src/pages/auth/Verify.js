import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

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

const Verify = () => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const initialValues = {
    otp: "",
  };

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^\d{4}$/, "OTP must be exactly 4 digits")
      .required("OTP is required"),
  });

  const verifyOtpForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      verifyOtp(values);
    },
  });

  const verifyOtp = async (otpInfo) => {
    try {
      const res = await httpClient.post("admin/auth/verify-otp", otpInfo);
      console.log("OTP Verification => ", res);

      if (res.data?.success) {
        setApiSuccess(true);
        setApiError(false);
        setAlertMessage("OTP Verified Successfully.");
        setCloseSnakeBar(true);
        navigate("/dashboard");
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      setLoading(false);
      setApiError(true);
      setApiSuccess(false);
      const errorMessage = error.response?.data?.message || "Invalid OTP";
      setAlertMessage(errorMessage);
      setCloseSnakeBar(true);
    }
  };

  return (
    <>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <PageTitle title={"Verify OTP"} />
        {loading && <Loader />}
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6}>
              <motion.div
                initial={{ scale: 0.8, rotateY: 90 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8 }}
              >
                <CCardGroup>
                  <CCard className="p-4 shadow-lg">
                    <CCardBody>
                      <Snackbar
                        open={closeSnakeBar}
                        autoHideDuration={1000}
                        message={alertMessage}
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

                      <CForm onSubmit={verifyOtpForm.handleSubmit}>
                        <motion.img
                          src={`${process.env.PUBLIC_URL}/images/logo.png`}
                          alt="Logo"
                          style={{ width: "80%", marginBottom: "1rem" }}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                        />
                        <p className="text-medium-emphasis">
                          Admin Please Enter your Code to Verify urself.
                        </p>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <i className="bi bi-shield-lock"></i>
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Enter OTP"
                            name="otp"
                            id="otp"
                            onChange={verifyOtpForm.handleChange}
                            value={verifyOtpForm.values.otp}
                            maxLength={4}
                          />
                          {verifyOtpForm.errors.otp &&
                            verifyOtpForm.touched.otp && (
                              <div className="invalid-feedback">
                                {verifyOtpForm.errors.otp}
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
                              Verify
                            </CButton>
                          </CCol>
                          <CCol xs={6} className="text-right">
                            <Link
                              style={{ paddingLeft: "81px", paddingRight: "0" }}
                            >
                              Resend OTP?
                            </Link>
                          </CCol>
                        </CRow>
                      </CForm>
                    </CCardBody>
                  </CCard>
                </CCardGroup>
              </motion.div>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  );
};

export default Verify;
