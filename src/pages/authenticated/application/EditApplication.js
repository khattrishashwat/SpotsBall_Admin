import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";

const EditApplication = () => {
  const [android_build, setAndroid_build] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  let navigate = useNavigate();
  let params = useParams();

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("");

    // Validate android_build
    if (!android_build) {
      setMessage("android_build is required.");
      setIsLoading(false);
      return;
    }

    const android_buildPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!android_buildPattern.test(android_build)) {
      setMessage("Please enter a valid android_build.");
      setIsLoading(false);
      return;
    }

    const updatedSocial = { android_build };

    httpClient
      .patch(`admin/apk-links/edit-apk-links/${params.id}`, updatedSocial)
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
      .get(`admin/apk-links/get-apk-links-by-id/${params.id}`)
      .then((res) => {
        const result = res.data.data; // Correctly access the `data` property
        console.log("Edit social => ", result);
        // Set the type from the API response
        setAndroid_build(result.android_build); // Set the android_build from the API response
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
            Back
          </Button>
          {isLoading && <Loader />}
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
            <TextField
              label="android_build"
              value={android_build}
              onChange={(e) => setAndroid_build(e.target.value)}
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
              {isLoading ? "Updating..." : "Update Application Link"}
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EditApplication;
