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
  const { x, y } = location.state || {};

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contestBanner, setContestBanner] = useState(null);
  const [playerImage, setPlayerImage] = useState(null);
  const [jackpotPrice, setJackpotPrice] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [contestStartDate, setContestStartDate] = useState("");
  const [contestEndDate, setContestEndDate] = useState("");
  const [originalPlayerImage, setOriginalPlayerImage] = useState(null);
  const [imageWidth, setImageWidth] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const [maxTickets, setMaxTickets] = useState("");
  const [quantities, setQuantities] = useState([0, 0, 0]);
  const [gstRate, setGstRate] = useState("");
  const [platformFeeRate, setPlatformFeeRate] = useState("");
  const [gstOnPlatformFeeRate, setGstOnPlatformFeeRate] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Create the initial state for winningCoordinates
  const initialCoordinates = x && y ? `{"x": ${x}, "y": ${y}}` : "";

  const [winningCoordinates, setWinningCoordinates] =
    useState(initialCoordinates);

  const handleSubmit = () => {
    setIsLoading(true);
    let formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("contest_banner", contestBanner);
    formData.append("player_image", playerImage);
    formData.append("jackpot_price", jackpotPrice);
    formData.append("ticket_price", ticketPrice);
    formData.append("contest_start_date", contestStartDate);
    formData.append("contest_end_date", contestEndDate);
    formData.append("original_player_image", originalPlayerImage);
    formData.append("winning_coordinates", winningCoordinates);
    formData.append("image_width", imageWidth);
    formData.append("image_height", imageHeight);
    formData.append("maxTickets", maxTickets);
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
      if (res.status) {
        setIsLoading(false);
        // Show success pop-up
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: res.data.message, // Display message from response
        }).then(() => {
          // Navigate to /contest_management after closing the pop-up
          navigate("/contest_management");
        });
      }
    })
    .catch((err) => {
      setIsLoading(false);
      console.log("error => ", err);
      // Show error pop-up with the message from the API response
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message,
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

  //  const handlePlayerImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setPlayerImage(file);

  //   const img = new Image();
  //   img.onload = () => {
  //     setImageWidth(img.width);
  //     setImageHeight(img.height);
  //   };
  //   img.src = URL.createObjectURL(file);
  // };

  // const handleOriginalPlayerImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setOriginalPlayerImage(file);

  //   const img = new Image();
  //   img.onload = () => {
  //     setImageWidth(img.width);
  //     setImageHeight(img.height);

  //     // Convert image to Data URI
  //     const canvas = document.createElement("canvas");
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     const ctx = canvas.getContext("2d");
  //     ctx.drawImage(img, 0, 0);

  //     // Get Data URI and pass it via navigate
  //     const dataUri = canvas.toDataURL("image/png");
  //     navigate("find-coordinates", {
  //       state: { imageDataUri: dataUri, width: img.width, height: img.height },
  //     });
  //   };
  //   img.src = URL.createObjectURL(file);
  // };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2, ml: 16 }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIcon />
          back
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, ml: 2 }}
          onClick={() => {
            window.location.href = "add-contest/find-coordinates";
          }}
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
            <label>Title</label>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter contest title"
              sx={{ border: "none" }}
            />

            <label>Description</label>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter contest description"
              sx={{ border: "none" }}
            />

            <label>Contest Banner</label>
            <TextField
              onChange={(e) => setContestBanner(e.target.files[0])}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
            />

            <label>Original Player Image</label>
            <TextField
              onChange={(e) => setOriginalPlayerImage(e.target.files[0])}
              // onChange={handleOriginalPlayerImageChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
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
            />

            <label>Ticket Price</label>
            <TextField
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter ticket price"
              sx={{ border: "none" }}
            />

            <label>Contest Start Date</label>
            <TextField
              value={contestStartDate}
              onChange={(e) => setContestStartDate(e.target.value)}
              fullWidth
              margin="normal"
              type="datetime-local"
              sx={{ border: "none" }}
            />

            <label>Contest End Date</label>
            <TextField
              value={contestEndDate}
              onChange={(e) => setContestEndDate(e.target.value)}
              fullWidth
              margin="normal"
              type="datetime-local"
              sx={{ border: "none" }}
            />

            <label>Player Image</label>
            <TextField
              onChange={handlePlayerImageChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
            />

            <label>Image Width</label>
            <TextField
              value={imageWidth}
              onChange={(e) => setImageWidth(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter image width"
              sx={{ border: "none" }}
            />

            <label>Image Height</label>
            <TextField
              value={imageHeight}
              onChange={(e) => setImageHeight(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter image height"
              sx={{ border: "none" }}
            />

            <label>Max Tickets</label>
            <TextField
              value={maxTickets}
              onChange={(e) => setMaxTickets(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter max tickets"
              sx={{ border: "none" }}
            />

            <label>Ticket Quantities</label>
            <div>
              <TextField
                value={quantities[0]}
                onChange={(e) => {
                  const newQuantities = [...quantities];
                  newQuantities[0] = e.target.value;
                  setQuantities(newQuantities);
                }}
                margin="normal"
                placeholder="Quantity 1"
              />
              <TextField
                value={quantities[1]}
                onChange={(e) => {
                  const newQuantities = [...quantities];
                  newQuantities[1] = e.target.value;
                  setQuantities(newQuantities);
                }}
                margin="normal"
                placeholder="Quantity 2"
              />
              <TextField
                value={quantities[2]}
                onChange={(e) => {
                  const newQuantities = [...quantities];
                  newQuantities[2] = e.target.value;
                  setQuantities(newQuantities);
                }}
                margin="normal"
                placeholder="Quantity 3"
              />
              <TextField
                value={quantities[3]}
                onChange={(e) => {
                  const newQuantities = [...quantities];
                  newQuantities[3] = e.target.value;
                  setQuantities(newQuantities);
                }}
                margin="normal"
                placeholder="Quantity 4"
              />
            </div>

            <label>GST Rate</label>
            <TextField
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter GST rate"
              sx={{ border: "none" }}
            />

            <label>Platform Fee Rate</label>
            <TextField
              value={platformFeeRate}
              onChange={(e) => setPlatformFeeRate(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter platform fee rate"
              sx={{ border: "none" }}
            />

            <label>GST on Platform Fee Rate</label>
            <TextField
              value={gstOnPlatformFeeRate}
              onChange={(e) => setGstOnPlatformFeeRate(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Enter GST on platform fee rate"
              sx={{ border: "none" }}
            />

            <Button
              onClick={handleSubmit}
              fullWidth
              sx={{
                marginTop: 2,
                backgroundColor: "#33ccff",
                color: "#fff",
              }}
            >
              Create Contest
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AddContest;
