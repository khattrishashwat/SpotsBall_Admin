import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import httpClient from "../../../util/HttpClient"; // Ensure this path is correct
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";

const AddApplication = () => {
  const [apkFile, setApkFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  let navigate = useNavigate();

  const handleFileChange = (e) => {
    setApkFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!apkFile) {
      setMessage("Please select an APK file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("apk_file", apkFile); // Ensure the backend expects "apk_file"

    try {
      const response = await httpClient.post(
        "admin/apk-links/add-apk-links",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("Application uploaded successfully!");
      setApkFile(null);
      navigate(-1);
    } catch (error) {
      console.log("Upload error:", error);
      setMessage(error?.response?.data?.message || "File upload failed.");
      setLoading(false);
    }
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
              Upload Application APK
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <input
                type="file"
                accept=".apk"
                onChange={handleFileChange}
                required
                style={{ marginBottom: "16px" }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  backgroundColor: "orange",
                }}
              >
                {loading ? "Uploading..." : "Upload"}
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
