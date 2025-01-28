import React, { useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddPress = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pressBanner, setPressBanner] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateField = (field, value) => {
    if (!value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: `${field} is required`,
      }));
    } else {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[field];
        return updatedErrors;
      });
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    validateField("title", value);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    validateField("description", value);
  };

  const handlePressBannerChange = (e) => {
    const file = e.target.files[0];
    setPressBanner(file);
    if (file) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.pressBanner;
        return updatedErrors;
      });
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!pressBanner) newErrors.pressBanner = "Press banner is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("press_banner", pressBanner);

    addPressToDB(formData);
  };

  const addPressToDB = (formData) => {
    httpClient
      .post(`admin/press/add-press`, formData)
      .then(() => {
        setIsLoading(false);
        Swal.fire({
          icon: "success",
          title: "Press added successfully!",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(-1); // Navigate back after closing the Swal
        });
      })
      .catch((err) => {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error adding press",
          text: "Please try again later.",
        });
        console.error("Error => ", err);
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
          onClick={() => navigate(-1)}
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
              error={!!errors.title}
              helperText={errors.title}
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
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}

            <label>Press Banner</label>
            <TextField
              onChange={handlePressBannerChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
              error={!!errors.pressBanner}
              helperText={errors.pressBanner}
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
              Add Press
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AddPress;
