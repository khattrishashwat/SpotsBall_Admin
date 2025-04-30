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

function TwoFactor() {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [pointerEvents, setPointerEvents] = useState("");

  const initialValues = {
    otp0: "",
    otp1: "",
    otp2: "",
    otp3: "",
  };

  const validationSchema = Yup.object().shape({
    otp0: Yup.string().required("Required"),
    otp1: Yup.string().required("Required"),
    otp2: Yup.string().required("Required"),
    otp3: Yup.string().required("Required"),
  });

  const verifyForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setPointerEvents("none");
      setOpacity(0.3);
      setLoading(true); // moved here
      verify(values);
    },
  });

  const verify = async (values) => {
    const otp = `${values.otp0}${values.otp1}${values.otp2}${values.otp3}`;

    try {
      const res = await httpClient.post("admin/auth/submit-login-otp", { otp });
      console.log("Verify => ", res.data?.data);

      const name = res.data?.data?.name;
      const token = res.data?.data?.token;

      if (token || name) {
        localStorage.setItem("name", name);
        localStorage.setItem("token", token);
        setApiSuccess(true);
        setApiError(false);
        setAlertMessage(`Welcome, ${name}`);
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

      const errorMessage = error.response?.data?.message;
      setAlertMessage(errorMessage);
      setCloseSnakeBar(true);
    }
  };

  return (
    <>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <PageTitle title={"Authenticate"} />
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

                    <CForm onSubmit={verifyForm.handleSubmit}>
                      <img
                        src={`${process.env.PUBLIC_URL}/images/logo.png`}
                        alt="Logo"
                        style={{ width: "80%", marginBottom: "1rem" }}
                      />
                      <p className="text-medium-emphasis">
                        Enter the 4 digits code for Authentication
                      </p>

                      <div className="d-flex justify-content-between mb-4">
                        {[0, 1, 2, 3].map((index) => (
                          <div key={index}>
                            <CFormInput
                              type="text"
                              maxLength={1}
                              id={`otp${index}`}
                              name={`otp${index}`}
                              value={verifyForm.values[`otp${index}`]}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                verifyForm.setFieldValue(`otp${index}`, value);
                                if (value && index < 3) {
                                  document
                                    .getElementById(`otp${index + 1}`)
                                    .focus();
                                }
                              }}
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Backspace" &&
                                  !verifyForm.values[`otp${index}`] &&
                                  index > 0
                                ) {
                                  document
                                    .getElementById(`otp${index - 1}`)
                                    .focus();
                                }
                              }}
                              onPaste={(e) => {
                                e.preventDefault();
                                const paste = e.clipboardData
                                  .getData("text")
                                  .slice(0, 4)
                                  .replace(/[^0-9]/g, "");
                                paste.split("").forEach((char, idx) => {
                                  verifyForm.setFieldValue(`otp${idx}`, char);
                                  const input = document.getElementById(
                                    `otp${idx}`
                                  );
                                  if (input) input.value = char;
                                });
                                setTimeout(() => {
                                  const next = document.getElementById(
                                    `otp${paste.length - 1}`
                                  );
                                  next?.focus();
                                }, 10);
                              }}
                              style={{
                                width: "3rem",
                                textAlign: "center",
                                fontSize: "1.5rem",
                              }}
                            />
                            {verifyForm.errors[`otp${index}`] &&
                              verifyForm.touched[`otp${index}`] && (
                                <div
                                  className="invalid-feedback d-block text-danger text-center"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {verifyForm.errors[`otp${index}`]}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>

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
}

export default TwoFactor;
