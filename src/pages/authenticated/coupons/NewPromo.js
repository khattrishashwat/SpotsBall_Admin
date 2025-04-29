import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Stack,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import httpClient from "../../../util/HttpClient";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const languages = ["English", "Hindi", "Telugu", "Tamil"];
const promoTypes = [
  "Simple Promo",
  "One Time Promo",
  "Expiring Promo",
  "Specific Day Promo",
  "Contest Multiple UsePromo",
  "Ticket RangePromo",
  "Special Promo",
];

const NewPromo = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedLang, setSelectedLang] = useState("English");
  const [promoType, setPromoType] = useState("One Time");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    discountType: Yup.string().required("Discount Type is required"),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be positive")
      .required("Amount is required"),

    expiryDate: Yup.string().when("promoType", {
      is: "Expiring Promo",
      then: Yup.string().required("Expiry Date is required"),
    }),

    isOneTime: Yup.boolean().when("promoType", {
      is: (val) => val === "One Time Promo" || val === "Special Promo",
      then: Yup.boolean().oneOf([true], "Must be checked"),
    }),

    validMultipleTimes: Yup.boolean().when("promoType", {
      is: "Contest Multiple UsePromo",
      then: Yup.boolean().oneOf([true], "Must be checked"),
    }),

    contestId: Yup.string().when("promoType", {
      is: (val) =>
        val === "Contest Multiple UsePromo" || val === "Special Promo",
      then: Yup.string().required("Contest ID is required"),
    }),

    validOnDate: Yup.string().when("promoType", {
      is: (val) => val === "Specific Day Promo" || val === "Special Promo",
      then: Yup.string().required("Valid Date is required"),
    }),

    minTickets: Yup.number().when("promoType", {
      is: (val) => val === "Ticket RangePromo" || val === "Special Promo",
      then: Yup.number().required("Minimum Tickets required"),
    }),

    maxTickets: Yup.number().when("promoType", {
      is: (val) => val === "Ticket RangePromo" || val === "Special Promo",
      then: Yup.number().required("Maximum Tickets required"),
    }),

    maxUsagePerUser: Yup.number().when("promoType", {
      is: (val) =>
        [
          "One Time Promo",
          "Contest Multiple UsePromo",
          "Ticket RangePromo",
          "Special Promo",
        ].includes(val),
      then: Yup.number().required("Max usage is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      discountType: "",
      amount: "",
      isOneTime: false,
      validMultipleTimes: false,
      expiryDate: "",
      validOnDate: "",
      maxUsagePerUser: "",
      contestId: "",
      minTickets: "",
      maxTickets: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setMessage("");

      let payload = {
        name: values.name,
        discountType: values.discountType,
        amount: parseFloat(values.amount),
      };

      // Add fields based on selected promo type
      if (promoType === "One Time") {
        payload.isOneTime = true;
        payload.maxUsagePerUser = parseInt(values.maxUsagePerUser);
      } else if (promoType === "Expiring Promo") {
        payload.expiryDate = values.expiryDate;
      } else if (promoType === "Particular Day") {
        payload.validOnDate = values.validOnDate;
      } else if (promoType === "Contest With Tickets") {
        payload.isOneTime = true;
        payload.validOnDate = values.validOnDate;
        payload.contestId = values.contestId;
        payload.minTickets = parseInt(values.minTickets);
        payload.maxTickets = parseInt(values.maxTickets);
        payload.maxUsagePerUser = 1;
      }

      try {
        await httpClient.post("admin/promocode-new/add-promocode", payload);
        setMessage("Promo code created successfully!");
        resetForm();
        navigate(-1);
      } catch (err) {
        setMessage(
          err?.response?.data?.errors?.[0]?.msg || "An error occurred"
        );
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
        <Container maxWidth="ml">
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
            <Typography variant="h5" gutterBottom>
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

            <FormControl fullWidth margin="normal">
              <InputLabel>Promo Type</InputLabel>
              <Select
                value={promoType}
                onChange={(e) => setPromoType(e.target.value)}
              >
                {promoTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
              <TextField
                fullWidth
                margin="normal"
                label={`Name (${selectedLang})`}
                {...formik.getFieldProps("name")}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />

              <FormControl
                fullWidth
                margin="normal"
                error={
                  formik.touched.discountType &&
                  Boolean(formik.errors.discountType)
                }
              >
                <InputLabel>Discount Type</InputLabel>
                <Select
                  label="Discount Type"
                  {...formik.getFieldProps("discountType")}
                >
                  <MenuItem value="fixed">{t("Fixed")}</MenuItem>
                  <MenuItem value="percentage">{t("Percentage")}</MenuItem>
                </Select>
                <FormHelperText>{formik.errors.discountType}</FormHelperText>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label={`Amount (${selectedLang})`}
                type="number"
                {...formik.getFieldProps("amount")}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />

              {promoType === "One Time Promo" && (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...formik.getFieldProps("isOneTime")}
                      checked={formik.values.isOneTime}
                      color="primary"
                    />
                  }
                  label="One Time Promo"
                />
              )}
              {promoType === "Contest Multiple UsePromo" && (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...formik.getFieldProps("validMultipleTimes")}
                      checked={formik.values.validMultipleTimes}
                      color="primary"
                    />
                  }
                  label="One Time Promo"
                />
              )}

              {promoType === "Expiring Promo" && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Expiring Promo"
                  type="datetime-local"
                  {...formik.getFieldProps("expiryDate")}
                  InputLabelProps={{ shrink: true }}
                  error={
                    formik.touched.expiryDate &&
                    Boolean(formik.errors.expiryDate)
                  }
                  helperText={
                    formik.touched.expiryDate && formik.errors.expiryDate
                  }
                />
              )}

              {(promoType === "Specific Day Promo" ||
                promoType === "Special Promo") && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Valid Day"
                  type="date"
                  {...formik.getFieldProps("validOnDate")}
                  InputLabelProps={{ shrink: true }}
                  error={
                    formik.touched.validOnDate &&
                    Boolean(formik.errors.validOnDate)
                  }
                  helperText={
                    formik.touched.validOnDate && formik.errors.validOnDate
                  }
                />
              )}

              {(promoType === "One Time Promo" ||
                promoType === "Contest Multiple UsePromo" ||
                promoType === "Ticket RangePromo" ||
                promoType === "Special Promo") && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Max Usage Per User"
                  type="number"
                  {...formik.getFieldProps("maxUsagePerUser")}
                  error={
                    formik.touched.maxUsagePerUser &&
                    Boolean(formik.errors.maxUsagePerUser)
                  }
                  helperText={
                    formik.touched.maxUsagePerUser &&
                    formik.errors.maxUsagePerUser
                  }
                />
              )}

              {(promoType === "Contest Multiple UsePromo" ||
                promoType === "Special Promo") && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Contest ID"
                  {...formik.getFieldProps("contestId")}
                  error={
                    formik.touched.contestId && Boolean(formik.errors.contestId)
                  }
                  helperText={
                    formik.touched.contestId && formik.errors.contestId
                  }
                />
              )}
              {(promoType === "Ticket RangePromo" ||
                promoType === "Special Promo") && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Min Tickets"
                  type="number"
                  {...formik.getFieldProps("minTickets")}
                  error={
                    formik.touched.minTickets &&
                    Boolean(formik.errors.minTickets)
                  }
                  helperText={
                    formik.touched.minTickets && formik.errors.minTickets
                  }
                />
              )}
              {(promoType === "Ticket RangePromo" ||
                promoType === "Special Promo") && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Max Tickets"
                  type="number"
                  {...formik.getFieldProps("maxTickets")}
                  error={
                    formik.touched.maxTickets &&
                    Boolean(formik.errors.maxTickets)
                  }
                  helperText={
                    formik.touched.maxTickets && formik.errors.maxTickets
                  }
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2, backgroundColor: "orange" }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>

            {message && (
              <Typography
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

export default NewPromo;
