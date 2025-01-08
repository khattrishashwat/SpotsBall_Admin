import React, { useState, useEffect } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditContest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { x, y } = location.state || {};

  // State management
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
  const [quantities, setQuantities] = useState(["", "", "", ""]);
  const [gstRate, setGstRate] = useState("");
  const [platformFeeRate, setPlatformFeeRate] = useState("");
  const [gstOnPlatformFeeRate, setGstOnPlatformFeeRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cousor, setCousor] = useState("");

  // Initialize winning coordinates
  const initialCoordinates = x && y ? `{"x": ${x}, "y": ${y}}` : "";
  const [winningCoordinates, setWinningCoordinates] =
    useState(initialCoordinates);
  console.log("initialCoordinates", winningCoordinates);
  console.log("winningCoordinates", winningCoordinates);

  useEffect(() => {
    setIsLoading(true);
    httpClient
      .get(`admin/get-contest/${params.id}`)
      .then((res) => {
        const result = res.data.data;
        const formattedDate = formatDate(result.contest_start_date);
        const forDate = formatDate(result.contest_end_date);
        console.log("dcfds", result.contest_end_date);
        console.log("forDatefff", formattedDate);
        console.log("forDate", result.contest_banner?.file_url);
        console.log("fo", result.player_image?.file_url);

        setTitle(result.title || "");
        setDescription(result.description || "");
        setContestBanner(result.contest_banner?.file_url || "");
        setPlayerImage(result.player_image?.file_url || "");
        setOriginalPlayerImage(result.original_player_image?.file_url || "");
        setJackpotPrice(result.jackpot_price || "");
        setTicketPrice(result.ticket_price || "");
        setContestStartDate(formattedDate || "");
        setContestEndDate(forDate || "");
        setImageWidth(result.image_width || "");
        setImageHeight(result.image_height || "");
        setMaxTickets(result.maxTickets || "");
        setQuantities(result.quantities || ["", "", "", ""]);
        setGstRate(result.gstRate || "");
        setPlatformFeeRate(result.platformFeeRate || "");
        setGstOnPlatformFeeRate(result.gstOnPlatformFeeRate || "");
        setWinningCoordinates(result.winning_coordinates || "");
        setCousor(result.cursor_color || "");
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error => ", err);
        setIsLoading(false);
      });
  }, [params.id]);

  const handleSubmit = () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("contest_banner", contestBanner);
    formData.append("player_image", playerImage);
    formData.append("jackpot_price", jackpotPrice);
    formData.append("ticket_price", ticketPrice);
    formData.append("contest_start_date", contestStartDate);
    // formData.append("contest_end_date", contestEndDate);
    formData.append("original_player_image", originalPlayerImage);

    try {
      const parsedCoordinates =
        typeof winningCoordinates === "string"
          ? JSON.parse(winningCoordinates) // Parse only if it's a string
          : winningCoordinates; // Use directly if it's already an object
      formData.append("winning_coordinates", JSON.stringify(parsedCoordinates)); // Always stringify for FormData
    } catch (error) {
      console.error("Invalid JSON format in winningCoordinates:", error);
      Swal.fire("Error", "Winning coordinates are invalid", "error");
      setIsLoading(false);
      return; // Stop submission if invalid
    }
    formData.append("cursor_color", cousor);

    formData.append("image_width", imageWidth);
    formData.append("image_height", imageHeight);
    formData.append("maxTickets", maxTickets);
    quantities.forEach((quantity, index) =>
      formData.append(`quantities[${index}]`, quantity)
    );
    formData.append("gstRate", gstRate);
    formData.append("platformFeeRate", platformFeeRate);
    formData.append("gstOnPlatformFeeRate", gstOnPlatformFeeRate);

    httpClient
      .patch(`admin/edit-contest/${params.id}`, formData)
      .then(() => {
        setIsLoading(false);
        Swal.fire("Success", "Contest updated successfully", "success");
        navigate(-1);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Update error => ", err);
        Swal.fire("Error", "Failed to update contest", "error");
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0"); // Add seconds

    // return `${day}-${month}-${year}T${hours}:${minutes}:${seconds}`;
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleDateChange = (e) => {
    const localDate = new Date(e.target.value);
    const offsetDate = new Date(localDate.getTime() + 5.5 * 60 * 60 * 1000); // Add 5 hours 30 minutes
    const isoDate = offsetDate.toISOString().slice(0, 16); // Get date-time in ISO format without timezone
    setContestStartDate(isoDate);
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
          back
        </Button>
        <Container maxWidth="sm" className="d-flex justify-content-center">
          {isLoading && <Loader />}
          <Box component="form" sx={{ mt: 4 }}>
            <Typography variant="h6">Edit Contest</Typography>

            <label>Title</label>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
            />

            <label>Description</label>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
            />

            <div>
              <label>Original Player Image</label>
              <TextField
                onChange={(e) => setOriginalPlayerImage(e.target.files[0])}
                // onChange={handleOriginalPlayerImageChange}
                fullWidth
                margin="normal"
                variant="outlined"
                type="file"
              />
              {originalPlayerImage && (
                <img
                  src={originalPlayerImage}
                  alt="Player Image Preview"
                  style={{
                    width: "100px",
                    height: "auto",
                    marginTop: "10px",
                  }}
                />
              )}
              {/* {originalPlayerImage && (
                <a
                  href={originalPlayerImage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Original Player Image
                </a>
              )} */}
            </div>
            <div>
              <label>Contest Banner</label>
              <TextField
                type="file"
                // value={contestBanner}
                onChange={(e) => setContestBanner(e.target.files[0])}
                fullWidth
                margin="normal"
              />
              {contestBanner && (
                <img
                  src={contestBanner}
                  alt="Player Image Preview"
                  style={{ width: "100px", height: "auto", marginTop: "10px" }}
                />
              )}
              {/* {contestBanner && contestBanner.startsWith("http") && (
                <a
                  href={contestBanner}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contest Image
                </a>
              )} */}
            </div>

            <div>
              <label>Player Image</label>
              <TextField
                type="file"
                // value={playerImage}
                onChange={(e) => setPlayerImage(e.target.files[0])}
                fullWidth
                margin="normal"
              />
              {playerImage && (
                <img
                  src={playerImage}
                  alt="Player Image Preview"
                  style={{ width: "100px", height: "auto", marginTop: "10px" }}
                />
              )}
              {/* {playerImage && playerImage.startsWith("http") && (
                <a href={playerImage} target="_blank" rel="noopener noreferrer">
                  View Player Image
                </a>      
              )} */}
            </div>
            <label>Jackpot Price</label>
            <TextField
              value={jackpotPrice}
              onChange={(e) => setJackpotPrice(e.target.value)}
              fullWidth
              margin="normal"
            />

            <label>Ticket Price</label>
            <TextField
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              fullWidth
              margin="normal"
            />

            <label>Contest Start Date</label>
            <TextField
              type="datetime-local"
              value={contestStartDate}
              onChange={handleDateChange}
              fullWidth
              margin="normal"
            />

            {/* <label>Contest End Date</label>
            <TextField
              type="datetime-local"
              value={contestEndDate}
              onChange={(e) => setContestEndDate(e.target.value)}
              fullWidth
              margin="normal"
              // value={description}
            /> */}

            <label>Winning Coordinates</label>
            <TextField
              value={`{"x": ${winningCoordinates.x}, "y": ${winningCoordinates.y}}`}
              // value={winningCoordinates}
              onChange={(e) => setWinningCoordinates(e.target.value)}
              fullWidth
              margin="normal"
              placeholder='{"x": , "y": }'
            />

            <label>Image Width</label>
            <TextField
              value={imageWidth}
              onChange={(e) => setImageWidth(e.target.value)}
              fullWidth
              margin="normal"
            />

            <label>Image Height</label>
            <TextField
              value={imageHeight}
              onChange={(e) => setImageHeight(e.target.value)}
              fullWidth
              margin="normal"
            />

            <label>Max Tickets</label>
            <TextField
              value={maxTickets}
              onChange={(e) => setMaxTickets(e.target.value)}
              fullWidth
              margin="normal"
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
            />

            <label>Platform Fee Rate</label>
            <TextField
              value={platformFeeRate}
              onChange={(e) => setPlatformFeeRate(e.target.value)}
              fullWidth
              margin="normal"
            />

            <label>GST on Platform Fee Rate</label>
            <TextField
              value={gstOnPlatformFeeRate}
              onChange={(e) => setGstOnPlatformFeeRate(e.target.value)}
              fullWidth
              margin="normal"
            />
            <label>Choose Cousor Color</label>
            <TextField
              value={cousor}
              onChange={(e) => setCousor(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              sx={{
                mt: 4,
                ml: 2,
                mb: 4,
                display: "block",
                backgroundColor: "orange",
              }}
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Update Contest
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EditContest;
