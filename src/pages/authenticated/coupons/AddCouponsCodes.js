import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import httpClient from "../../../util/HttpClient";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const languages = ["English", "Hindi", "Telugu", "Tamil"];

const AddCouponsCodes = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  let navigate = useNavigate();

  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState("English");

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must not exceed 50 characters")
      .required("Name is required"),
    amount: Yup.number()
      .typeError("Amount must be a valid number")
      .positive("Amount must be greater than zero")
      .required("Amount is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", amount: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setMessage("");

      try {
        await httpClient.post("admin/promocode/add-promocode", values);
        setMessage("Promo code created successfully!");
        resetForm();
        navigate(-1);
      } catch (err) {
        console.error("Error:", err?.response?.data?.errors[0]?.msg);
        setMessage(err?.response?.data?.errors[0]?.msg || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 4,
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 1,
            }}
          >
            <Typography variant="h5" component="h1" gutterBottom>
              {t("Add New Promo Code")}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              {languages.map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLang === lang ? "contained" : "outlined"}
                  onClick={() => setSelectedLang(lang)}
                >
                  {lang}
                </Button>
              ))}
            </Stack>

            <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
              <span>
                {t("Name")} ({selectedLang})
              </span>
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <span>
                {t("Amount")} ({selectedLang})
              </span>

              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                id="amount"
                name="amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 4,
                  mb: 4,
                  backgroundColor: "orange",
                }}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
            {message && (
              <Typography
                variant="body2"
                color={message.includes("successfully") ? "green" : "red"}
                sx={{ mt: 2 }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AddCouponsCodes;
