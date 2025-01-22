import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditPress = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [pressBanner, setPressBanner] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleLinkChange = (e) => setLink(e.target.value);
  const handlePressBannerChange = (e) => setPressBanner(e.target.files[0]);

  const handleSubmit = () => {
    setIsLoading(true);
    let formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("link", link);
    if (pressBanner) formData.append("press_banner", pressBanner);

    updateGroupInDB(formData);
  };

  const updateGroupInDB = (groupData) => {
    httpClient
      .patch(`admin/press/edit-press/${params.id}`, groupData)
      .then((res) => {
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
      .get(`admin/press/get-press-by-id/${params.id}`)
      .then((res) => {
        const result = res.data.data;
        setIsLoading(false);
        setTitle(result.title);
        setDescription(result.description);
        setLink(result.link);
        setPressBanner(result.press_banner);
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
              placeholder="Enter title here..."
              sx={{
                border: "none",
              }}
            />

            <label>Description</label>
            <TextField
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              margin="normal"
              placeholder="Enter description here..."
              multiline
              rows={4}
              sx={{
                border: "none",
              }}
            />

            <label>Link</label>
            <TextField
              value={link}
              onChange={handleLinkChange}
              fullWidth
              margin="normal"
              placeholder="Enter link here..."
              type="url" // Enforces URL format
              sx={{
                border: "none",
              }}
              helperText="Please enter a valid URL (e.g., https://example.com)"
            />

            <label>Press Banner</label>
            <TextField
              onChange={handlePressBannerChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
            />

            <Button
              variant="contained"
              color="primary"
 sx={{
                mt: 4,
                ml: 2,
                mb: 4,
                display: "block",
                backgroundColor: "orange",
              }}              onClick={handleSubmit}
              disabled={isLoading}
            >
              Update
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EditPress;
