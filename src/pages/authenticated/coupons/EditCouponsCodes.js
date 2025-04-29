import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const languages = ["English", "Hindi", "Telugu", "Tamil"];

const EditCouponsCodes = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedLang, setSelectedLang] = useState("English");
  const { t } = useTranslation();

  let params = useParams();
  let navigate = useNavigate();

  const handleSubmit = () => {
    setIsLoading(true);

    httpClient
      .patch(`admin/promocode/edit-promocode/${params.id}`, {
        name,
        amount,
      })
      .then((response) => {
        setIsLoading(false);
        setMessage(response.data.message);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(-1); // Go back to the previous page
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        setMessage("Failed to update the promo code. Please try again.");
      });
  };

  useEffect(() => {
    httpClient
      .get(`admin/promocode/get-promocode-by-id/${params.id}`)
      .then((res) => {
        const data = res.data.data;
        setName(data.name);
        setAmount(data.amount);

        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        setMessage("Failed to load promo code details.");
      });
  }, [params.id]);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Update Coupons" />

        <Container maxWidth="sm">
          {isLoading && <Loader />}
          {!isLoading && (
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
              <Typography variant="h5" component="h1" gutterBottom>
                {t("Edit Promo Code")}
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
              <span>
                {t("Name")} ({selectedLang})
              </span>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <span>
                {t("Amount")} ({selectedLang})
              </span>

              <TextField
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                type="number"
              />

              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 4,
                  ml: 2,
                  mb: 4,
                  display: "block",
                  backgroundColor: "orange",
                }}
                onClick={handleSubmit}
              >
                {t("Update")}
              </Button>
            </Box>
          )}
        </Container>
      </div>
    </>
  );
};

export default EditCouponsCodes;
