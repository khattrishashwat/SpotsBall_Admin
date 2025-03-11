import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PageTitle from "../../common/PageTitle";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import httpClient from "../../../util/HttpClient"; // Ensure this path is correct
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddApplication = () => {
  const [apkFile, setApkFile] = useState(null);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const { t } = useTranslation();

  const handleFileChange = (e) => {
    setApkFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!apkFile) {
      Swal.fire({
        icon: "error",
        title: t("Error"),
        text: t("Please select an APK file."),
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("apk_file", apkFile); // Ensure the backend expects "apk_file"

    try {
      await httpClient.post("admin/apk-links/add-apk-links", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: t("Success"),
        text: t("Application uploaded successfully!"),
      });

      setApkFile(null);
      setTimeout(() => navigate(-1), 1500); // Delay before navigation
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("Upload Failed"),
        text: error?.response?.data?.message || t("File upload failed."),
      });
      setLoading(false);
    }
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title={t("Add Application")} />

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
              {t("Upload Application APK")}
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 2, mb: 2 }}
              >
                {t("Choose File")}
                <input
                  type="file"
                  accept=".apk"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>

              {apkFile && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {t("Selected File")}: {apkFile.name}
                </Typography>
              )}

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
                {loading ? t("Uploading...") : t("Upload")}
              </Button>
            </form>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AddApplication;
