import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";

const EditBanner = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [bannerImages, setBannerImages] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null); // For image preview
  const [corousal, setCorousal] = useState([]);
  const [courusalInput, setCourusalInput] = useState("");
  const [courusalError, setCourusalError] = useState(false); // Validation state
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleSubtitleChange = (e) => setSubTitle(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBannerImages(file);
    setBannerPreview(URL.createObjectURL(file)); // Create a preview URL
  };

  const handleCorousalInputChange = (e) => {
    setCourusalInput(e.target.value);
    setCourusalError(false); // Reset error on input change
  };

  const handleAddCourusal = () => {
    if (!courusalInput.trim()) {
      setCourusalError(true); // Show error if input is empty
      return;
    }

    setCorousal([...corousal, courusalInput]);
    setCourusalInput("");
    setCourusalError(false); // Reset error
  };

  const handleRemoveCarousel = (index) => {
    const updatedCorousal = corousal.filter((_, i) => i !== index);
    setCorousal(updatedCorousal);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append("title", title);
    formData.append("sub_title", subTitle);
    formData.append("banner", bannerImages);
    corousal.forEach((item, index) => {
      formData.append(`corousal[${index}]`, item);
    });

    updateBannerInDB(formData);
  };

  const updateBannerInDB = (formData) => {
    httpClient
      .patch(`admin/edit-banner/${params.id}`, formData)
      .then(() => {
        setIsLoading(false);

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Banner updated successfully!",
          confirmButtonColor: "#3085d6",
        });

        // Navigate back to the previous page
        navigate(-1);
      })
      .catch((err) => {
        setIsLoading(false);

        // Show error message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update the banner. Please try again.",
          confirmButtonColor: "#d33",
        });
      });
  };

  useEffect(() => {
    httpClient
      .get(`admin/get-banner-by-id/${params.id}`)
      .then((res) => {
        const result = res.data.data;

        setIsLoading(false);
        setTitle(result.title);
        setSubTitle(result.sub_title);
        setCorousal(result.corousal || []);
        setBannerPreview(result.banner); // Use existing banner URL for preview
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
            sx={{ mt: 6, width: "80%" }}
          >
            {/* Title Field */}
            <label>Title</label>
            <TextField
              value={title}
              onChange={handleTitleChange}
              fullWidth
              margin="normal"
              placeholder="Enter banner title"
              sx={{ border: "none" }}
            />

            {/* Subtitle Field */}
            <label className="mt-4">Subtitle</label>
            <TextField
              value={subTitle}
              onChange={handleSubtitleChange}
              fullWidth
              margin="normal"
              placeholder="Enter subtitle"
              sx={{ border: "none" }}
            />

            {/* Banner Image */}
            <label className="mt-4">Banner Image</label>
            <TextField
              onChange={handleImageChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
            />
            {bannerPreview && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={bannerPreview}
                  alt="Banner Preview"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </Box>
            )}

            {/* Carousel Titles */}
            <label className="mt-4">Carousel Titles</label>
            <TextField
              value={courusalInput}
              onChange={handleCorousalInputChange}
              fullWidth
              margin="normal"
              placeholder="Enter carousel title"
              error={courusalError} // Highlight error
              helperText={courusalError ? "This field is required" : ""}
              sx={{
                border: courusalError ? "0px solid red" : "none", // Red border on error
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: "orange" }}
              onClick={handleAddCourusal}
            >
              Add Carousel
            </Button>

            {/* Display Carousel Titles with Remove Option */}
            <Box sx={{ mt: 2 }}>
              {corousal.length > 0 && (
                <ul>
                  {corousal.map((item, index) => (
                    <li key={index}>
                      {item}
                      <Button
                        variant="text"
                        color="error"
                        sx={{ ml: 2 }}
                        onClick={() => handleRemoveCarousel(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Box>

            {/* Submit Button */}
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
              Update Banner
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EditBanner;
