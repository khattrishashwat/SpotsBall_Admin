import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EditPress = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pressBanner, setPressBanner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handlePressBannerChange = (e) => setPressBanner(e.target.files[0]);

  const handleSubmit = () => {
    setIsLoading(true);
    let formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
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
            <CKEditor
              editor={ClassicEditor}
              data={description} // Bind the description value to CKEditor
              onChange={(event, editor) => {
                const data = editor.getData();
                setDescription(data); // Update the description state
              }}
              config={
                {
                  // Add custom CKEditor configurations here if needed
                }
              }
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
              }}
              onClick={handleSubmit}
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
