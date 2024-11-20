import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditBanner = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [bannerImages, setBannerImages] = useState(null);
  const [courusal, setCourusal] = useState([]); // Carousel titles array
  const [courusalInput, setCourusalInput] = useState(""); // Temporary state for carousel title input
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleSubtitleChange = (e) => setSubTitle(e.target.value);
  const handleImageChange = (e) => setBannerImages(e.target.files[0]);
  const handleCourusalInputChange = (e) => setCourusalInput(e.target.value);

  const handleAddCourusal = () => {
    if (courusalInput.trim()) {
      setCourusal([...courusal, courusalInput]);
      setCourusalInput("");
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    let formData = new FormData();
    formData.append("title", title);
    formData.append("sub_title", subTitle);
    formData.append("banner", bannerImages);
    courusal.forEach((item, index) => {
      formData.append(`courusal[${index}]`, item);
    });

    updateBannerInDB(formData);
  };

  const updateBannerInDB = (formData) => {
    httpClient
      .patch(`admin/edit-bannerr/${params.id}`, formData)
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
      .get(`admin/get-banner-by-id/${params.id}`)
      .then((res) => {
        const result = res.data.data;
        console.log("result", result.sub_title);

        setIsLoading(false);
        setTitle(result.title);
        setSubTitle(result.sub_title);
        setBannerImages(result.banner);
        setCourusal(result.corousal || []);
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
              value={bannerImages}
              onChange={handleImageChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
            />

            {/* Carousel Titles */}
            <label className="mt-4">Carousel Titles</label>
            <TextField
              value={courusalInput}
              onChange={handleCourusalInputChange}
              fullWidth
              margin="normal"
              placeholder="Enter carousel title"
              sx={{ border: "none" }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, backgroundColor: "orange" }}
              onClick={handleAddCourusal}
            >
              Add Carousel
            </Button>

            {/* Display Carousel Titles */}
            <Box sx={{ mt: 2 }}>
              {courusal.length > 0 && (
                <ul>
                  {courusal.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </Box>

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 8, ml: 2, display: "block", backgroundColor: "orange" }}
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
