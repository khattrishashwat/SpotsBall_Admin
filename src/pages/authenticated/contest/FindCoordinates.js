import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

const FindCoordinates = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [xCoordinate, setXCoordinate] = useState("");
  const [yCoordinate, setYCoordinate] = useState("");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const imgRef = useRef(null); // To reference the image element

  // Handle click event on the image to save clicked coordinates
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

  // Handle mouse move to update tooltip coordinates in real-time
  const handleMouseMove = (e) => {
    const image = e.target;
    const rect = image.getBoundingClientRect();
    const xRelative = e.clientX - rect.left;
    const yRelative = e.clientY - rect.top;

    const x = ((xRelative / rect.width) * image.naturalWidth).toFixed(2);
    const y = ((yRelative / rect.height) * image.naturalHeight).toFixed(2);

    setCoordinates({ x, y });
  };

  // Show and hide the tooltip on hover
  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  const handleSaveCoordinates = () => {
    const coordinates = { xCoordinate, yCoordinate };
    navigate(-1, {
      state: {
        winningCoordinates: coordinates,
        imageDataUri: location.state.imageDataUri,
      },
    });
  };

  return (
    <div>
      <h3>Find Coordinates for Image</h3>
      <div style={{ position: "relative" }}>
        <img
          src={location.state.imageDataUri}
          alt="Player"
          ref={imgRef}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: "crosshair", maxWidth: "100%", height: "auto" }}
        />
        {showTooltip && (
          <div
            style={{
              position: "absolute",
              left: `${coordinates.x}px`,
              top: `${coordinates.y}px`,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              pointerEvents: "none",
              transform: "translate(-50%, -100%)",
              whiteSpace: "nowrap",
              fontSize: "12px",
            }}
          >
            X: {coordinates.x}, Y: {coordinates.y}
          </div>
        )}
      </div>
      <TextField
        value={xCoordinate}
        onChange={(e) => setXCoordinate(e.target.value)}
        placeholder="X Coordinate"
      />
      <TextField
        value={yCoordinate}
        onChange={(e) => setYCoordinate(e.target.value)}
        placeholder="Y Coordinate"
      />
      <Button onClick={handleSaveCoordinates} variant="contained">
        Save Coordinates
      </Button>
    </div>
  );
};

export default FindCoordinates;
