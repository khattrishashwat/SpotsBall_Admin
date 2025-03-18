import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";


const EditSocials = () => {
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
    const { t } = useTranslation();

  let navigate = useNavigate();
  let params = useParams();

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("");

    // Validate URL
    if (!url) {
      setMessage("URL is required.");
      setIsLoading(false);
      return;
    }

    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!urlPattern.test(url)) {
      setMessage("Please enter a valid URL.");
      setIsLoading(false);
      return;
    }

    const updatedSocial = { type, url };

    httpClient
      .patch(
        `admin/live-links/edit-live-links/${params.id}`,
        updatedSocial
      )
      .then((res) => {
        console.log("Updated social => ", res);
        setIsLoading(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Links updated successfully!",
          confirmButtonColor: "#3085d6",
        });
        navigate(-1);
      })
      .catch((err) => {
        
        setMessage("Failed to update the social link.");
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update the Links. Please try again.",
          confirmButtonColor: "#d33",
        });
      });
  };

  useEffect(() => {
    setIsLoading(true);
    httpClient
      .get(`admin/live-links/get-live-links-by-id/${params.id}`)
      .then((res) => {
        const result = res.data.data; // Correctly access the `data` property
        console.log("Edit social => ", result);
        setType(result.type); // Set the type from the API response
        setUrl(result.url); // Set the URL from the API response
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching social data => ", err);
        setIsLoading(false);
      });
  }, [params.id]);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Container maxWidth="sm">
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2, ml: 0 }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
            {t("Back")}
          </Button>
          {isLoading && <Loader />}
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
            <TextField
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              InputLabelProps={{
                sx: { marginTop: "5px" },
              }}
            />
            <TextField
              label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              InputLabelProps={{
                sx: { marginTop: "5px" },
              }}
            />
            {message && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}
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
              disabled={isLoading}
            >
              {isLoading ? t("Updating...") : t("Update Social Link")}
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EditSocials;
