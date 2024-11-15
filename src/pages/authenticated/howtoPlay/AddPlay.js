import React, { useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddPlay = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [howToPlayBanner, setHowToPlayBanner] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleThumbnailChange = (e) => setThumbnail(e.target.files[0]);
  const handleHowToPlayBannerChange = (e) =>
    setHowToPlayBanner(e.target.files[0]);

  const handleSubmit = () => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    formData.append("howToPlayBanner", howToPlayBanner);

    AddPlayToDB(formData);
  };

  const AddPlayToDB = (groupData) => {
    httpClient
      .post(`admin/add-how-to-play`, groupData)
      .then((res) => res.data)
      .then((data) => {
        if (data.status) {
          setIsLoading(false);
          navigate(-1);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("error => ", err);
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
          sx={{ mt: 2, ml: 16 }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIcon />
          Back
        </Button>
        <Container maxWidth="sm" className="d-flex justify-content-center">
          {isLoading && <Loader />}
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
              placeholder="Enter the title"
              sx={{ border: "none" }}
            />
            <label>Description</label>
            <TextField
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              margin="normal"
              placeholder="Enter the description"
              sx={{ border: "none" }}
              multiline
              rows={4}
            />
            <label className="mt-4">Thumbnail (Image)</label>
            <TextField
              onChange={handleThumbnailChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
              inputProps={{ accept: "image/*" }}
            />
            <label className="mt-4">How To Play Banner (Video)</label>
            <TextField
              onChange={handleHowToPlayBannerChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
              inputProps={{ accept: "video/*" }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 8, ml: 2, display: "block", backgroundColor: "orange" }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Add Play
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AddPlay;
