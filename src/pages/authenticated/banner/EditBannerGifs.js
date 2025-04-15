import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Card,
  Paper,
  CardMedia,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";

function EditBannerGifs() {
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();

  const [bannerGifs, setBannerGifs] = useState([]); // Preview ke liye
  const [oldGifs, setOldGifs] = useState([]); // Original GIFs ke liye
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    httpClient
      .get(`admin/banner-gifs/get-banner-gifs-by-id/${params.id}`)
      .then((res) => {
        const gifs = res.data.data.bannerGifs || [];
        setBannerGifs(gifs); // Preview ke liye
        setOldGifs(gifs); // Original GIFs rakhnay ke liye
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("axios error => ", err);
        setIsLoading(false);
      });
  }, [params.id]);

  const handleReplaceGif = (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    let newGifs = [...bannerGifs];
    newGifs[index] = URL.createObjectURL(file); // Preview ke liye update karein

    let updatedOldGifs = [...oldGifs];
    updatedOldGifs[index] = file; // Original file ko save karein

    setBannerGifs(newGifs);
    setOldGifs(updatedOldGifs);
  };

  const updateBannerGifs = () => {
    if (bannerGifs.length !== 4) {
      Swal.fire("Error", "Please select exactly 4 GIFs!", "error");
      return;
    }

    const formData = new FormData();
    oldGifs.forEach((gif, index) => {
      if (gif instanceof File) {
        formData.append(`newGifs`, gif); // Agar naya file hai toh FormData mein bhejein
      } else {
        formData.append(`oldGifs`, gif); // Agar purana URL hai toh woh bhejein
      }
    });

    httpClient
      .patch(`admin/banner-gifs/edit-banner-gifs/${params.id}`, formData)
      .then(() => {
        Swal.fire("Success", "Banner GIFs updated successfully!", "success");
        navigate(-1);
      })
      .catch((err) => {
        Swal.fire("Error", "Failed to update GIFs!", "error");
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
          sx={{ mt: 2, ml: 10 }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
          {t("Back")}
        </Button>

        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
              {t("Edit Banner GIFs")}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: "100px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {bannerGifs.map((gif, index) => (
                <Card
                  key={index}
                  sx={{ maxWidth: 200, textAlign: "center", p: 2 }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={gif}
                    alt={`GIF ${index + 1}`}
                    sx={{
                      borderRadius: "8px",
                      objectFit: "cover",
                      "&:hover": {
                        transform: "scale(1.05)",
                        transition: "0.3s",
                      },
                    }}
                  />
                  <input
                    type="file"
                    accept="image/gif"
                    style={{ display: "none" }}
                    id={`file-input-${index}`}
                    onChange={(e) => handleReplaceGif(e, index)}
                  />
                  <label htmlFor={`file-input-${index}`}>
                    <Button
                      variant="outlined"
                      component="span"
                      color="primary"
                      sx={{ mt: 1 }}
                    >
                      {t("Replace")}
                    </Button>
                  </label>
                </Card>
              ))}
            </Box>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4, display: "block", mx: "auto" }}
              onClick={updateBannerGifs}
            >
              {t("Update GIFs")}
            </Button>
          </Paper>
        </Container>
      </div>
    </>
  );
}

export default EditBannerGifs;
