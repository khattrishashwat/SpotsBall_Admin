import React, { useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";

const AddContest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { x, y, image } = location.state || {}; // Fetch x, y, and image from location state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contestBanner, setContestBanner] = useState(null);
  const [playerImage, setPlayerImage] = useState(null);
  const [jackpotPrice, setJackpotPrice] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [contestStartDate, setContestStartDate] = useState("");
  const [contestEndDate, setContestEndDate] = useState("");
  const [imageWidth, setImageWidth] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const [maxTickets, setMaxTickets] = useState("");
  const [quantities, setQuantities] = useState([0, 0, 0, 0]); // Adjusted to have 4 quantities
  const [gstRate, setGstRate] = useState("");
  const [platformFeeRate, setPlatformFeeRate] = useState("");
  const [gstOnPlatformFeeRate, setGstOnPlatformFeeRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
const [cousor,setCousor]=useState("");
  // Corrected definition of originalPlayerImage
  const originalPlayerImage = image; // Using the image from the location state
  const initialCoordinates = x && y ? `{"x": ${x}, "y": ${y}}` : "";
  const [winningCoordinates, setWinningCoordinates] =
    useState(initialCoordinates);

  const handleSubmit = () => {
    if (!winningCoordinates) {
      Swal.fire({
        icon: "warning",
        title: "Choose Coordinates First",
        text: "Please choose coordinates before filling any fields.",
      });
      return;
    }

    setIsLoading(true);
    let formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("contest_banner", contestBanner);
    formData.append("player_image", playerImage);
    formData.append("jackpot_price", jackpotPrice);
    formData.append("ticket_price", ticketPrice);
    formData.append("contest_start_date", contestStartDate);
    // formData.append("contest_end_date", contestEndDate);
    formData.append("original_player_image", originalPlayerImage);
    formData.append("winning_coordinates", winningCoordinates);
    formData.append("image_width", imageWidth);
    formData.append("image_height", imageHeight);
    formData.append("maxTickets", maxTickets);
    formData.append("cursor_color", cousor);

    quantities.forEach((quantity, index) =>
      formData.append(`quantities[${index}]`, quantity)
    );

    formData.append("gstRate", gstRate);
    formData.append("platformFeeRate", platformFeeRate);
    formData.append("gstOnPlatformFeeRate", gstOnPlatformFeeRate);

    AddContestToDB(formData);
  };

  const AddContestToDB = (groupData) => {
    setIsLoading(true);
    httpClient
      .post(`admin/add-contest`, groupData)
      .then((res) => {
        setIsLoading(false);
        if (res.status) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: res.data.message,
          }).then(() => {
            navigate("/contest_management");
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message,
        });
      });
  };

  const handlePlayerImageChange = (e) => {
    const file = e.target.files[0];
    setPlayerImage(file);

    // Load the image dimensions automatically
    const img = new Image();
    img.onload = () => {
      setImageWidth(img.width);
      setImageHeight(img.height);
    };
    img.src = URL.createObjectURL(file);
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
          onClick={() => navigate("/contest_management")}
        >
          <ArrowBackIcon />
          back
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, ml: 2 }}
          onClick={() =>
            (window.location.href = "add-contest/find-coordinates")
          }
        >
          Find Coordinates
        </Button>
        <Container maxWidth="sm" className="d-flex justify-content-center">
          {isLoading && <Loader />}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ mt: 4, width: "80%" }}
          >
            {winningCoordinates ? null : (
              <p style={{ color: "red" }}>
                Please first choose coordinates before filling any fields.
              </p>
            )}

            {/* Disable form inputs if coordinates are not chosen */}
            <label>Title</label>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter contest title"
              sx={{ border: "none" }}
              disabled={!winningCoordinates}
            />

            <label>Description</label>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter contest description"
              sx={{ border: "none" }}
              disabled={!winningCoordinates}
            />

            <label>Contest Banner</label>
            <TextField
              onChange={(e) => setContestBanner(e.target.files[0])}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
              disabled={!winningCoordinates}
            />

            <label>Winning Coordinates</label>
            <TextField
              value={winningCoordinates}
              onChange={(e) => setWinningCoordinates(e.target.value)}
              fullWidth
              margin="normal"
              placeholder='{"x": , "y": }'
            />

            <label>Jackpot Price</label>
            <TextField
              value={jackpotPrice}
              onChange={(e) => setJackpotPrice(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter jackpot price"
              sx={{ border: "none" }}
              disabled={!winningCoordinates}
            />

            <label>Ticket Price</label>
            <TextField
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter ticket price"
              sx={{ border: "none" }}
              disabled={!winningCoordinates}
            />

            <label>Contest Start Date</label>
            <TextField
              value={contestStartDate}
              onChange={(e) => setContestStartDate(e.target.value)}
              fullWidth
              margin="normal"
              type="datetime-local"
              sx={{ border: "none" }}
              InputProps={{
                inputProps: {
                  min: new Date().toISOString().slice(0, 16), // Restrict to current or future date
                },
              }}
              disabled={!winningCoordinates}
            />

            <label>Player Image</label>
            <TextField
              onChange={handlePlayerImageChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
              disabled={!winningCoordinates}
            />

            <label>Image Width</label>
            <TextField
              value={imageWidth}
              onChange={(e) => setImageWidth(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter image width"
              sx={{ border: "none" }}
              disabled={!winningCoordinates}
            />

            <label>Image Height</label>
            <TextField
              value={imageHeight}
              onChange={(e) => setImageHeight(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter image height"
              sx={{ border: "none" }}
              disabled={!winningCoordinates}
            />

            <label>Max Tickets</label>
            <TextField
              value={maxTickets}
              onChange={(e) => setMaxTickets(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter max ticket count"
              sx={{ border: "none" }}
              disabled={!winningCoordinates}
            />

            {/* Quantities */}
            <label>Ticket Quantities</label>
            {[0, 1, 2, 3].map((index) => (
              <TextField
                key={index}
                value={quantities[index]}
                onChange={(e) => {
                  const updatedQuantities = [...quantities];
                  updatedQuantities[index] = e.target.value;
                  setQuantities(updatedQuantities);
                }}
                fullWidth
                margin="normal"
                placeholder={`Enter quantity for ticket type ${index + 1}`}
                sx={{ border: "none" }}
                disabled={!winningCoordinates}
              />
            ))}

            <label>GST Rate</label>
            <TextField
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter GST rate"
              sx={{ border: "none" }}
              disabled={!winningCoordinates}
            />

            <label>Platform Fee Rate</label>
            <TextField
              value={platformFeeRate}
              onChange={(e) => setPlatformFeeRate(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter platform fee rate"
              sx={{ border: "none" }}
              disabled={!winningCoordinates}
            />

            <label>GST on Platform Fee Rate</label>
            <TextField
              value={gstOnPlatformFeeRate}
              onChange={(e) => setGstOnPlatformFeeRate(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter GST on platform fee rate"
              sx={{ border: "none" }}
              disabled={!winningCoordinates}
            />
            <label>Choose Cousor Color</label>
            <TextField
              // type="color"
              value={cousor}
              onChange={(e) => setCousor(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter Cousor Color"
              sx={{ border: "none" }}
              disabled={!winningCoordinates}
            />

            <Button
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 4 }}
              disabled={!winningCoordinates}
            >
              Add Contest
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AddContest;
