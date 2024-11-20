import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditPlay = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [howToPlayBanner, setHowToPlayBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleThumbnailChange = (e) => setThumbnail(e.target.files[0]);
  const handleHowToPlayBannerChange = (e) =>
    setHowToPlayBanner(e.target.files[0]);

  const handleSubmit = () => {
    setIsLoading(true);
    const formData = new FormData();

    // Add title and description to the form data
    formData.append("title", title);
    formData.append("description", description);

    // Append both files under the same key if they exist
    if (thumbnail) {
      formData.append("howToPlayBanner", thumbnail);
    }
    if (howToPlayBanner) {
      formData.append("howToPlayBanner", howToPlayBanner);
    }

    updatePlayInDB(formData);
  };

  const updatePlayInDB = (formData) => {
    httpClient
      .patch(`edit-how-to-play/${params.id}`, formData)
      .then(() => {
        setIsLoading(false);
        navigate(-1); // Navigate back to the previous page
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Error updating data:", err);
      });
  };

  useEffect(() => {
    httpClient
      .get(`admin/get-how-to-play-by-id/${params.id}`)
      .then((res) => {
        const result = res.data.data;
        setIsLoading(false);
        setTitle(result.title);
        setDescription(result.description);
        setThumbnail(result.thumbnail_url);
        setHowToPlayBanner(result.video_url);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
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
          Back
        </Button>
        <Container maxWidth="sm" className="d-flex justify-content-center">
          {isLoading ? (
            <Loader />
          ) : (
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ mt: 4, width: "80%" }}
            >
              <label>Title</label>
              <TextField
                value={title}
                onChange={handleTitleChange}
                fullWidth
                margin="normal"
                placeholder="Party, Picnic, Birthday, Love, Romance..."
              />
              <label className="mt-4">Description</label>
              <TextField
                value={description}
                onChange={handleDescriptionChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                placeholder="Enter a description..."
              />
              <label className="mt-4">Thumbnail</label>
              <TextField
                onChange={handleThumbnailChange}
                fullWidth
                margin="normal"
                variant="outlined"
                type="file"
              />
              <label className="mt-4">How to Play Banner (Video)</label>
              <TextField
                onChange={handleHowToPlayBannerChange}
                fullWidth
                margin="normal"
                variant="outlined"
                type="file"
              />
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 8,
                  ml: 2,
                  display: "block",
                  backgroundColor: "orange",
                }}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Update
              </Button>
            </Box>
          )}
        </Container>
      </div>
    </>
  );
};

export default EditPlay;
