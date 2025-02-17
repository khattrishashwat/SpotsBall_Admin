import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";

const EditApplication = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    httpClient
      .get(`admin/apk-links/get-apk-links-by-id/${id}`)
      .then((res) => {
        setFile(null); // Reset file state
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setMessage(
          err?.response?.data?.message || "Failed to fetch APK details."
        );
      });
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(""); // Clear error message on file selection
  };

  const handleSubmit = async () => {
    if (!file) {
      setMessage("Please select an APK file to upload.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("android_build", file);

    try {
      const response = await httpClient.patch(
        `admin/apk-links/edit-apk-links/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
        confirmButtonColor: "#3085d6",
      });

      navigate(-1);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update the file.");

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "An error occurred.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Container maxWidth="sm">
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>

          {isLoading && <Loader />}

          <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
            <input
              type="file"
              accept=".apk"
              onChange={handleFileChange}
              required
              style={{
                display: "block",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
                marginBottom: "16px",
              }}
            />
            {message && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}
            <Button
              variant="contained"
              sx={{ mt: 4, mb: 4, backgroundColor: "orange", color: "white" }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update APK File"}
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EditApplication;
