import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import httpClient from "../../../util/HttpClient"; // Ensure this path is correct based on your project structure
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";

const AddApplication = () => {
  const [android_build, setAndroid_build] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Check if android_build is empty or invalid
    if (!android_build) {
      setMessage("android_build is required.");
      setLoading(false);
      return;
    }

    // Simple android_build validation (you can improve this if needed)
    const android_buildPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!android_buildPattern.test(android_build)) {
      setMessage("Please enter a valid android_build.");
      setLoading(false);
      return;
    }

    await httpClient
      .post("admin/apk-links/add-apk-links", {
     
        android_build,
      })
      .then((res) => {
        setMessage("Application link Added successfully!");

        setAndroid_build("");
        navigate(-1);
      })
      .catch((err) => {
        console.log("error => ", err);
        setMessage(err?.response?.data?.message);
        setLoading(false);
      });
  };

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
              Create Application Link
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                label="android_build"
                variant="outlined"
                fullWidth
                margin="normal"
                value={android_build}
                onChange={(e) => setAndroid_build(e.target.value)}
                required
                type="android_build"
                InputLabelProps={{
                  sx: {
                    marginTop: "8px",
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 4,
                  ml: 2,
                  mb: 4,
                  display: "block",
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

export default AddApplication;
