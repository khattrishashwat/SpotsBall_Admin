import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";
import { IconButton } from "rsuite";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const AppSetting = () => {
  const [formData, setFormData] = useState({
    imageUrl: "",
    imageName: "",
    likesPerDay: "",
    email: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    httpClient
      .get("/admin/app_setting") // Replace with your API endpoint
      .then((response) => {
        const data = response?.data?.result;
        setIsLoading(false);
        setFormData({
          imageUrl: data?.comparing_image,
          imageName: data?.comparing_image_name,
          likesPerDay: data?.no_of_likes_perday,
          email: data?.contact_us_email,
        });
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  }, []);

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setFormData((prevData) => ({
        ...prevData,
        imageName: file.name,
      }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (PATCH request)
  const handleUpdate = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Prepare form data for API request
    const updateData = {
      comparing_image_name: formData.imageName,
      no_of_likes_perday: formData.likesPerDay,
      contact_us_email: formData.email,
    };

    if (selectedImage) {
      // If a new image is selected, you may need to handle image upload
      // Here you can upload the image and get the URL, then send it in the update
      // For simplicity, we assume the image URL is updated directly in this demo
      updateData.comparing_image_name = URL.createObjectURL(selectedImage);
    }

    httpClient
      .put("/admin/app_setting", updateData) // Replace with your PATCH API endpoint
      .then((response) => {
        setIsLoading(false);
        Swal.fire({
          text: "App Setting Updated!",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error updating data:", error);
        Swal.fire({
          text: "Failed to Updated",
          icon: "info",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      });
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="App Setting" />
        <Box
          sx={{
            p: 2,
            maxWidth: 600,
            mx: "auto",
            mt: 4,
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          {isLoading && <Loader />}

          {/* <Typography variant="h5" align="center" gutterBottom>
            Editable Image Comparison Form
          </Typography> */}

          <form onSubmit={handleUpdate}>
            <Grid container spacing={3}>
              {/* Comparing Image Field */}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ display: "block", mb: 2 }}
                >
                  Edit Comparing Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : formData.imageUrl
                    }
                    alt={formData.imageName}
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Grid>

              {/* Comparing Image Name Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  // label="Comparing Image Name"
                  placeholder="Comparing Image Name"
                  variant="outlined"
                  name="imageName"
                  value={formData.imageName}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* No of Likes Per Day Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  // label="Comparing Image Name"
                  placeholder="Likes Per Day"
                  variant="outlined"
                  name="likesPerDay"
                  type="number"
                  value={formData.likesPerDay}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Contact Us Email Field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  // label="Contact Us Email"
                  placeholder="Contact Us Email"
                  variant="outlined"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Update Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                  }}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </div>
    </>
  );
};

export default AppSetting;
