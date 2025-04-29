import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const languages = ["English", "Hindi", "Telugu", "Tamil"];

const EditPromoCodes = () => {
  const [name, setName] = useState("");
  const [minTickets, setMinTickets] = useState("");
  const [maxTickets, setMaxTickets] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedLang, setSelectedLang] = useState("English");
  const { t } = useTranslation();

  let params = useParams();
  let navigate = useNavigate();

  const handleSubmit = () => {
    setMessage("");
    setIsLoading(true);

    // Validation: Ensure maxTickets > minTickets
    if (parseInt(maxTickets) <= parseInt(minTickets)) {
      setMessage("Max Tickets must be greater than Min Tickets.");
      setIsLoading(false);
      return;
    }

    httpClient
      .patch(`admin/discount/edit-discount/${params.id}`, {
        name,
        minTickets,
        maxTickets,
        discountPercentage,
      })
      .then(() => {
        setIsLoading(false);
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
      .get(`admin/discount/get-discount-by-id/${params.id}`)
      .then((res) => {
        const data = res.data.data;
        setName(data.name);
        setMinTickets(data.minTickets);
        setMaxTickets(data.maxTickets);
        setDiscountPercentage(data.discountPercentage);
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
        <PageTitle title="Update Promo Code" />

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
              {t("Create a New Discount Coupons")}
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
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <span>
                {t("Name")} ({selectedLang})
              </span>
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <span>
                {t("Minimum Tickets")} ({selectedLang})
              </span>

              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                value={minTickets}
                onChange={(e) => setMinTickets(e.target.value)}
                required
                type="number"
              />
              <span>
                {t("Maximum Tickets")} ({selectedLang})
              </span>

              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                value={maxTickets}
                onChange={(e) => setMaxTickets(e.target.value)}
                required
                type="number"
              />
              <span>
                {t("Discount Percentage")} ({selectedLang})
              </span>

              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                required
                type="number"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
                sx={{
                  mt: 4,
                  mb: 4,
                  backgroundColor: "orange",
                }}
              >
                {isLoading ? "Submitting..." : "Submit"}
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

export default EditPromoCodes;
