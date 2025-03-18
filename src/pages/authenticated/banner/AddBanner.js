import React, { useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";

const AddBanner = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [bannerImages, setBannerImages] = useState(null);
  const [courusal, setCourusal] = useState("");
  const [courusalInput, setCourusalInput] = useState(""); // Temporary state for carousel title input
    const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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

    AddBannerToDB(formData);
  };

  const AddBannerToDB = (formData) => {
    httpClient
      .post(`admin/banner/add-banner`, formData)
      .then((res) => {
        setIsLoading(false);
        navigate(-1);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("error => ", err);
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
            <label>{t("Title")}</label>
            <TextField
              value={title}
              onChange={handleTitleChange}
              fullWidth
              margin="normal"
              placeholder="Enter banner title"
              sx={{ border: "none" }}
            />
            <label className="mt-4">{t("Subtitle")}</label>
            <TextField
              value={subTitle}
              onChange={handleSubtitleChange}
              fullWidth
              margin="normal"
              placeholder="Enter subtitle"
              sx={{ border: "none" }}
            />
            <label className="mt-4">{t("Banner Image")}</label>
            <TextField
              onChange={handleImageChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
            />
            <label className="mt-4">{t("Carousel Title")}</label>
            <TextField
              value={courusalInput}
              onChange={handleCourusalInputChange}
              fullWidth
              margin="normal"
              placeholder={t("Enter carousel title")}
              sx={{ border: "none" }}
            />

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, backgroundColor: "orange" }}
              onClick={handleAddCourusal}
            >
              {t("Add Carousel")}
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

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 8, ml: 2, display: "block", backgroundColor: "orange" }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {t("Add Banner")}
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AddBanner;
