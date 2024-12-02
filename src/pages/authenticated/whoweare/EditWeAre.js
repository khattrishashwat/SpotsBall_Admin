import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditWeAre = () => {
  const [description, setDescription] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [images, setImages] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

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

    let formData = new FormData();
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("image", images);

    EditWeAreToDB(formData);
  };

  const EditWeAreToDB = (formData) => {
    httpClient
      .patch(`api/v1/admin/who-we-are/edit-who-we-are/${params.id}`, formData)
      .then(() => {
        setIsLoading(false);
        navigate(-1);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("error => ", err);
      });
  };

  useEffect(() => {
    httpClient
      .get(`api/v1/admin/who-we-are/get-who-we-are-by-id/${params.id}`)
      .then((res) => {
        const result = res.data.data;

        setIsLoading(false);

        setSubTitle(result.subTitle);
        setDescription(result.description);
        setImages(result.image);
      })
      .catch((err) => {
        console.log("axios error => ", err);
        setIsLoading(false);
      });
  }, [params.id]);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2, ml: 16 }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
          back
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
              Edit "Who We Are" Section
            </Typography>

            <label>Subtitle</label>
            <TextField
              value={subTitle}
              onChange={handleSubtitleChange}
              fullWidth
              margin="normal"
              placeholder="Enter subtitle"
            />

            <label>Description</label>
            <TextField
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              margin="normal"
              placeholder="Enter description"
            />

            <label>Image</label>
            <TextField
              onChange={handleImageChange}
              fullWidth
              margin="normal"
              type="file"
              inputProps={{ accept: "image/*" }}
            />

            {imagePreview && (
              <Box mt={2}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              </Box>
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
              Add
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EditWeAre;
