import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Container,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import httpClient from "../../../util/HttpClient";
import { throttle } from "lodash"; // For throttling mouse move
import { useTranslation } from "react-i18next";

import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";

const FindCoordinates = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const [xCoordinate, setXCoordinate] = useState("");
  const [yCoordinate, setYCoordinate] = useState("");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const imgRef = useRef(null);
  const [imgFile, setImgFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [originalPlayerImage, setOriginalPlayerImage] = useState(null);
    const { t } = useTranslation();

  // Get the image passed from the state or location
  useEffect(() => {
    if (location?.state) {
      setImgFile(location.state?.bannerImage);
    }
  }, [location]);

  const handleImageClick = (e) => {
    const img = imgRef.current;
    if (img) {
      const rect = img.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const realX = ((clickX / rect.width) * img.naturalWidth).toFixed(2);
      const realY = ((clickY / rect.height) * img.naturalHeight).toFixed(2);
      setXCoordinate(realX);
      setYCoordinate(realY);
    }
  };

  const handleMouseMove = throttle((e) => {
    const image = e.target;
    const rect = image.getBoundingClientRect();
    const xRelative = e.clientX - rect.left;
    const yRelative = e.clientY - rect.top;
    const x = ((xRelative / rect.width) * image.naturalWidth).toFixed(2);
    const y = ((yRelative / rect.height) * image.naturalHeight).toFixed(2);
    setCoordinates({ x, y });
  }, 100);

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  const handleSaveCoordinates = () => {
    if (!xCoordinate || !yCoordinate) {
      setError("Please select valid coordinates.");
      return;
    }

    const winning_coordinates = {
      x: xCoordinate,
      y: yCoordinate,
    };

    setIsLoading(true);
    const formData = new FormData();
    formData.append("original_player_image", originalPlayerImage);
    formData.append("winning_coordinates", JSON.stringify(winning_coordinates));

    httpClient
      .patch(`admin/contest/edit-contest/${params.id}`, formData)
      .then((response) => {
        setIsLoading(false);
        navigate(-1);
      })
      .catch((err) => {
        setIsLoading(false);
        setError("Failed to save coordinates. Please try again.");
        console.error("Error:", err);
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalPlayerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={() => navigate(-1)} color="secondary">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h3" ml={1}>
              {t("Find Coordinates for Image")}
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Button
              variant="contained"
              color="primary"
              component="label"
              sx={{ mb: 2 }}
            >
              {t("Choose Your Original Image")}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>

            {imgFile && (
              <Box position="relative" mb={2} width="100%" maxWidth="500px">
                <img
                  src={imgFile}
                  alt="Target"
                  ref={imgRef}
                  onClick={handleImageClick}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    cursor: "crosshair",
                    width: "100%",
                    height: "auto",
                    borderRadius: 8,
                  }}
                />
                {showTooltip && imgRef.current && (
                  <Box
                    position="absolute"
                    left={`${
                      (coordinates.x / imgRef.current.naturalWidth) *
                        imgRef.current.clientWidth +
                      1
                    }px`}
                    top={`${
                      (coordinates.y / imgRef.current.naturalHeight) *
                        imgRef.current.clientHeight +
                      1
                    }px`}
                    backgroundColor="rgba(0, 0, 0, 0.7)"
                    color="#fff"
                    pointerEvents="none"
                    zIndex={10}
                    padding="2px 5px"
                    borderRadius="5px"
                  >
                    X: {coordinates.x}, Y: {coordinates.y}
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            mb={3}
          >
            <span>{t("X Coordinate")}</span>
            <TextField
              value={xCoordinate}
              onChange={(e) => setXCoordinate(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ maxWidth: 300 }}
              aria-label="X Coordinate"
              disabled
            />
            <span>{t("Y Coordinate")}</span>
            <TextField
              value={yCoordinate}
              onChange={(e) => setYCoordinate(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ maxWidth: 300 }}
              aria-label="Y Coordinate"
              disabled
            />
            {!xCoordinate || !yCoordinate ? (
              <Typography color="error" sx={{ mt: 1 }}>
                {t("Please select X and Y coordinates before saving.")}
              </Typography>
            ) : null}
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              onClick={handleSaveCoordinates}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              aria-label="Save Coordinates"
              disabled={!xCoordinate || !yCoordinate || isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Save Coordinates"
              )}
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default FindCoordinates;
