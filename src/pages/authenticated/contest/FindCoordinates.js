import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Container,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";

const FindCoordinates = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageDataUri, setImageDataUri] = useState("");
  const [xCoordinate, setXCoordinate] = useState("");
  const [yCoordinate, setYCoordinate] = useState("");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const imgRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageDataUri(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (e) => {
    const img = imgRef.current;
    if (img) {
      const rect = img.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const realX = Math.round((clickX / rect.width) * img.naturalWidth);
      const realY = Math.round((clickY / rect.height) * img.naturalHeight);
      setXCoordinate(realX);
      setYCoordinate(realY);
    }
  };

  const handleMouseMove = (e) => {
    const image = e.target;
    const rect = image.getBoundingClientRect();
    const xRelative = e.clientX - rect.left;
    const yRelative = e.clientY - rect.top;
    const x = ((xRelative / rect.width) * image.naturalWidth).toFixed(2);
    const y = ((yRelative / rect.height) * image.naturalHeight).toFixed(2);
    setCoordinates({ x, y });
  };

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  // const handleSaveCoordinates = () => {
  //   const coordinate = { x: xCoordinate, y: yCoordinate };
  //   navigate("add-contest", {
  //     state: {
  //       winningCoordinate: coordinate,
  //     },
  //   });
  // };

  const handleSaveCoordinates = () => {
    navigate("/contest_management/add-contest", {
      state: {
        x: xCoordinate,
        y: yCoordinate,
      },
    });
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
              Find Coordinates for Image
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Button
              variant="contained"
              component="label"
              color="primary"
              sx={{ mb: 2 }}
              aria-label="Choose Original Image"
            >
              Choose Original Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            {imageDataUri && (
              <Box position="relative" mb={2} width="100%" maxWidth="500px">
                <img
                  src={imageDataUri}
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
            <span>X Coordinate</span>
            <TextField
              value={xCoordinate}
              onChange={(e) => setXCoordinate(e.target.value)}
              label="X Coordinate"
              variant="outlined"
              fullWidth
              sx={{ maxWidth: 300 }}
              aria-label="X Coordinate"
            />
            <span>Y Coordinate</span>
            <TextField
              value={yCoordinate}
              onChange={(e) => setYCoordinate(e.target.value)}
              label="Y Coordinate"
              variant="outlined"
              fullWidth
              sx={{ maxWidth: 300 }}
              aria-label="Y Coordinate"
            />
            <Button
              onClick={handleSaveCoordinates}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              aria-label="Save Coordinates"
            >
              Save Coordinates
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default FindCoordinates;
