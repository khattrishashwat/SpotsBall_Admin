import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useTranslation } from "react-i18next";

const AddWeAre = () => {
  const [description, setDescription] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [images, setImages] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
    const { t } = useTranslation();

  // Event Handlers
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleSubtitleChange = (e) => setSubTitle(e.target.value);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImages(file);
    setImagePreview(URL.createObjectURL(file)); // Generate preview URL
  };

  const handleSubmit = () => {
    if (!subTitle || !description || !images) {
      alert("All fields are required.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("image", images);

    AddWeAreToDB(formData);
  };

  const AddWeAreToDB = (formData) => {
    httpClient
      .post(`admin/who-we-are/add-who-we-are`, formData)
      .then((res) => {
        setIsLoading(false);
        navigate(-1); // Navigate back after successful addition
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Error:", err);
        alert("Failed to add. Please try again later.");
      });
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Button
          variant="contained"
          color="secondary"
          sx={{
            mt: 4,
            ml: 2,
            mb: 4,
            display: "block",
            backgroundColor: "orange",
          }}
          onClick={() => navigate(-1)} // Navigate back
        >
          <ArrowBackIcon />
          {t("Back")}
        </Button>

        <Container maxWidth="sm" className="d-flex justify-content-center">
          {isLoading && <Loader />}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ mt: 4, width: "80%" }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("Add Who We Are Section")}
            </Typography>

            {/* Subtitle Field */}
            <label>{t("Subtitle")}</label>
            <TextField
              value={subTitle}
              onChange={handleSubtitleChange}
              fullWidth
              margin="normal"
              placeholder="Enter subtitle"
            />

            {/* Description Field with CKEditor */}
            <Typography variant="h6" sx={{ mt: 2 }}>
              {t("Description:")}
            </Typography>
            <CKEditor
              editor={ClassicEditor}
              data={description || ""} // Ensure it's always a valid string
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log(data); // Check what data is being returned
                setDescription(data); // Update state correctly
              }}
            />

            {/* Image Upload Field */}
            <label>{t("Image")}</label>
            <TextField
              onChange={handleImageChange}
              fullWidth
              margin="normal"
              type="file"
              inputProps={{ accept: "image/*" }}
            />

            {/* Image Preview */}
            {imagePreview && (
              <Box mt={2}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              </Box>
            )}

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4, display: "block", backgroundColor: "orange" }}
              onClick={handleSubmit}
              disabled={isLoading} // Disable while loading
            >
              {t("Add")}
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AddWeAre;
