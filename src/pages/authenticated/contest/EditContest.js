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

  // Initialize winning coordinates
  const initialCoordinates = x && y ? `{"x": ${x}, "y": ${y}}` : "";
  const [winningCoordinates, setWinningCoordinates] =
    useState(initialCoordinates);
  console.log("initialCoordinates", winningCoordinates);

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
    const year = date.getFullYear().toString().slice(-2); // get last two digits of the year
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
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
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              type="file"
              value={contestBanner}
              onChange={(e) => setContestBanner(e.target.files[0])}
              fullWidth
              margin="normal"
            />
            <TextField
              type="file"
              value={playerImage}
              onChange={(e) => setPlayerImage(e.target.files[0])}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Jackpot Price"
              value={jackpotPrice}
              onChange={(e) => setJackpotPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Ticket Price"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              type="datetime-local"
              label="Contest Start Date"
              value={contestStartDate}
              onChange={(e) => setContestStartDate(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              type="datetime-local"
              label="Contest End Date"
              value={contestEndDate}
              onChange={(e) => setContestEndDate(e.target.value)}
              fullWidth
              margin="normal"
              // value={description}
            />
            <TextField
              label="Winning Coordinates"
              value={`{"x": ${winningCoordinates.x}, "y": ${winningCoordinates.y}}`}
              onChange={(e) => setWinningCoordinates(e.target.value)}
              fullWidth
              margin="normal"
              placeholder='{"x": , "y": }'
            />
            <TextField
              label="Image Width"
              value={imageWidth}
              onChange={(e) => setImageWidth(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Image Height"
              value={imageHeight}
              onChange={(e) => setImageHeight(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Max Tickets"
              value={maxTickets}
              onChange={(e) => setMaxTickets(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="GST Rate"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Platform Fee Rate"
              value={platformFeeRate}
              onChange={(e) => setPlatformFeeRate(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="GST on Platform Fee Rate"
              value={gstOnPlatformFeeRate}
              onChange={(e) => setGstOnPlatformFeeRate(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              sx={{ mt: 2 }}
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
