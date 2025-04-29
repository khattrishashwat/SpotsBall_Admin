import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Grid,
} from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const languages = ["English", "Hindi", "Telugu", "Tamil"];

const EditContest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { x, y } = location.state || {};
  const { t } = useTranslation();

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
  const [cousor, setCousor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [errors, setErrors] = useState({});

  // Winning coordinates
  const initialCoordinates = x && y ? `{"x": ${x}, "y": ${y}}` : "";
  const [winningCoordinates, setWinningCoordinates] =
    useState(initialCoordinates);

  // Helper to count words
  const countWords = (str) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  // Helper: only allow digits (for numeric validations)
  const isNumeric = (value) => /^\d*$/.test(value);

  // Validation function for fields
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value) error = "Title is required";
        else if (countWords(value) > 150)
          error = "Title must not exceed 150 words";
        break;
      case "description":
        if (!value) error = "Description is required";
        else if (countWords(value) > 200)
          error = "Description must not exceed 200 words";
        break;
      case "jackpotPrice":
        if (!value) error = "Jackpot Price is required";
        else if (!isNumeric(value)) error = "Jackpot Price must be numeric";
        else if (value.length < 1 || value.length > 5)
          error = "Jackpot Price must be between 1 and 5 digits";
        break;
      case "ticketPrice":
        if (!value) error = "Ticket Price is required";
        else if (!isNumeric(value)) error = "Ticket Price must be numeric";
        else if (value.length < 1 || value.length > 5)
          error = "Ticket Price must be between 1 and 5 digits";
        break;
      case "contestStartDate":
        if (!value) error = "Contest Start Date is required";
        break;
      case "imageWidth":
        if (!value) error = "Image Width is required";
        else if (isNaN(value)) error = "Image Width must be a number";
        break;
      case "imageHeight":
        if (!value) error = "Image Height is required";
        else if (isNaN(value)) error = "Image Height must be a number";
        break;
      case "maxTickets":
        if (!value) error = "Max Tickets is required";
        else if (!isNumeric(value)) error = "Max Tickets must be numeric";
        else if (value.length < 1 || value.length > 3)
          error = "Max Tickets must be between 1 and 3 digits";
        break;
      case "cousor":
        if (!value) error = "Cursor color is required";
        break;
      default:
        break;
    }
    return error;
  };

  // Handlers for word-limited fields
  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (countWords(value) <= 150) {
      setTitle(value);
    } else {
      Swal.fire("Validation Error", "Title must not exceed 150 words", "error");
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (countWords(value) <= 200) {
      setDescription(value);
    } else {
      Swal.fire(
        "Validation Error",
        "Description must not exceed 200 words",
        "error"
      );
    }
  };

  // General handler for other fields (jackpotPrice, ticketPrice, maxTickets, cousor, contestStartDate)
  const handleChange = (e) => {
    const { name, value } = e.target;
    // For numeric fields, only update if the value is numeric
    if (
      (name === "jackpotPrice" ||
        name === "ticketPrice" ||
        name === "maxTickets") &&
      !isNumeric(value)
    ) {
      return;
    }

    switch (name) {
      case "jackpotPrice":
        if (value.length <= 5) setJackpotPrice(value);
        break;
      case "ticketPrice":
        if (value.length <= 5) setTicketPrice(value);
        break;
      case "contestStartDate":
        setContestStartDate(value);
        break;
      case "maxTickets":
        if (value.length <= 3) setMaxTickets(value);
        break;
      case "cousor":
        setCousor(value);
        break;
      default:
        break;
    }
  };

  // Handler for quantities that only allows positive integers (no negatives or decimals)
  const handleQuantityChange = (index, value) => {
    // Accept only positive integers (or empty)
    if (/^(0|[1-9]\d*)?$/.test(value)) {
      const newQuantities = [...quantities];
      newQuantities[index] = value;
      setQuantities(newQuantities);
    }
  };

  // Image validation
  const validateImage = (file) => {
    const allowedTypes = ["image/png", "image/jpeg"];
    if (!file || !allowedTypes.includes(file.type)) {
      Swal.fire(
        "Invalid File",
        "Only PNG and JPEG images are allowed.",
        "error"
      );
      return false;
    }
    return true;
  };

  const handleFileChange = (e, setImageState) => {
    const file = e.target.files[0];
    if (validateImage(file)) {
      setImageState(file);
    }
  };

  const handlePlayerImageChange = (e) => {
    const file = e.target.files[0];
    if (validateImage(file)) {
      setPlayerImage(file);
      const img = new Image();
      img.onload = () => {
        setImageWidth(img.width.toString());
        setImageHeight(img.height.toString());
      };
      img.src = URL.createObjectURL(file);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    httpClient
      .get(`admin/contest/get-contest/${params.id}`)
      .then((res) => {
        const result = res.data.data;
        const formattedStart = formatDate(result.contest_start_date);
        const formattedEnd = formatDate(result.contest_end_date);
        setTitle(result.title || "");
        setDescription(result.description || "");
        setContestBanner(result.contest_banner?.file_url || "");
        setPlayerImage(result.player_image?.file_url || "");
        // setOriginalPlayerImage(result.original_player_image?.file_url || "");
        setJackpotPrice(result.jackpot_price || "");
        setTicketPrice(result.ticket_price || "");
        setContestStartDate(formattedStart || "");
        setContestEndDate(formattedEnd || "");
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

  // Format date to local datetime string without milliseconds and Z.
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().slice(0, -5);
  };

  const handleSubmit = () => {
    // Validate fields before submission
    const newErrors = {};
    newErrors.title = validateField("title", title);
    newErrors.description = validateField("description", description);
    newErrors.jackpotPrice = validateField("jackpotPrice", jackpotPrice);
    newErrors.ticketPrice = validateField("ticketPrice", ticketPrice);
    newErrors.contestStartDate = validateField(
      "contestStartDate",
      contestStartDate
    );
    newErrors.imageWidth = validateField("imageWidth", imageWidth);
    newErrors.imageHeight = validateField("imageHeight", imageHeight);
    newErrors.maxTickets = validateField("maxTickets", maxTickets);
    newErrors.cousor = validateField("cousor", cousor);

    // If any error exists, show alert and abort
    const errorKeys = Object.keys(newErrors).filter((key) => newErrors[key]);
    if (errorKeys.length > 0) {
      Swal.fire(
        "Validation Error",
        "Please fix the errors before submitting.",
        "error"
      );
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("contest_banner", contestBanner);
    formData.append("player_image", playerImage);
    formData.append("jackpot_price", jackpotPrice);
    formData.append("ticket_price", ticketPrice);
    formData.append("contest_start_date", contestStartDate);
    // contest_end_date not used
    // formData.append("original_player_image", originalPlayerImage);
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
      .patch(`admin/contest/edit-contest/${params.id}`, formData)
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
          Back
        </Button>
        <Container maxWidth="lg">
          {isLoading && <Loader />}
          <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Edit Contest
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              {languages.map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLang === lang ? "contained" : "outlined"}
                  onClick={() => setSelectedLang(lang)}
                >
                  {lang}
                </Button>
              ))}
            </Stack>
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={4}>
                {/* Left Side Fields */}
                <Grid item xs={12} md={6}>
                  <Typography>{t(`Title*(${selectedLang})`)}</Typography>
                  <TextField
                    name="title"
                    value={title}
                    onChange={handleTitleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.title}
                    helperText={errors.title}
                  />
                  <Typography>{t(`Description*(${selectedLang})`)}</Typography>

                  <TextField
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                  <Typography>
                    {t(`Jackpot Price*(${selectedLang})`)}
                  </Typography>

                  <TextField
                    name="jackpotPrice"
                    value={jackpotPrice}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.jackpotPrice}
                    helperText={errors.jackpotPrice}
                    inputProps={{ maxLength: 5 }}
                  />
                  <Typography>{t(`Ticket Price*(${selectedLang})`)}</Typography>

                  <TextField
                    name="ticketPrice"
                    value={ticketPrice}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.ticketPrice}
                    helperText={errors.ticketPrice}
                    inputProps={{ maxLength: 5 }}
                  />
                  <Typography>
                    {t(`Contest Start Date*(${selectedLang})`)}
                  </Typography>

                  <TextField
                    name="contestStartDate"
                    value={contestStartDate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    type="datetime-local"
                    error={!!errors.contestStartDate}
                    helperText={errors.contestStartDate}
                    InputProps={{
                      inputProps: {
                        min: new Date().toISOString().slice(0, 16),
                      },
                    }}
                  />
                  <Typography>{t(`Max Tickets*(${selectedLang})`)}</Typography>

                  <TextField
                    name="maxTickets"
                    value={maxTickets}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.maxTickets}
                    helperText={errors.maxTickets}
                    inputProps={{ maxLength: 3 }}
                  />
                  <Typography>
                    {t(`Choose Cursor Color*(${selectedLang})`)}
                  </Typography>

                  <TextField
                    name="cousor"
                    value={cousor}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.cousor}
                    helperText={errors.cousor}
                  />
                  <Typography>{t(`GST Rate*(${selectedLang})`)}</Typography>

                  <TextField
                    fullWidth
                    margin="normal"
                    value={gstRate}
                    disabled
                  />
                  <Typography>
                    {t(`Platform Fee Rate*(${selectedLang})`)}
                  </Typography>

                  <TextField
                    fullWidth
                    margin="normal"
                    value={platformFeeRate}
                    disabled
                  />
                  <Typography>
                    {t(`GST on Platform Fee Rate*(${selectedLang})`)}
                  </Typography>

                  <TextField
                    fullWidth
                    margin="normal"
                    value={gstOnPlatformFeeRate}
                    disabled
                  />
                </Grid>

                {/* Right Side Fields */}
                <Grid item xs={12} md={6}>
                  <Typography>
                    {t(`Contest Banner Image*(${selectedLang})`)}
                  </Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="file"
                    onChange={(e) => handleFileChange(e, setContestBanner)}
                  />

                  {contestBanner && (
                    <img
                      src={
                        typeof contestBanner === "string"
                          ? contestBanner
                          : URL.createObjectURL(contestBanner)
                      }
                      alt="Banner Preview"
                      style={{ width: "100px", marginTop: "10px" }}
                    />
                  )}
                  <Typography>
                    {t(`Play Screen Imagele*(${selectedLang})`)}
                  </Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="file"
                    onChange={handlePlayerImageChange}
                  />
                  {playerImage && (
                    <img
                      src={
                        typeof playerImage === "string"
                          ? playerImage
                          : URL.createObjectURL(playerImage)
                      }
                      alt="Player Preview"
                      style={{ width: "100px", marginTop: "10px" }}
                    />
                  )}
                  <Typography>{t(`Image Width*(${selectedLang})`)}</Typography>
                  <TextField
                    name="imageWidth"
                    value={imageWidth}
                    fullWidth
                    margin="normal"
                    disabled
                    error={!!errors.imageWidth}
                    helperText={errors.imageWidth}
                  />
                  <Typography>{t(`Image Height*(${selectedLang})`)}</Typography>
                  <TextField
                    name="imageHeight"
                    value={imageHeight}
                    fullWidth
                    margin="normal"
                    disabled
                    error={!!errors.imageHeight}
                    helperText={errors.imageHeight}
                  />
                  {quantities.map((quantity, index) => (
                    <Box key={index}>
                      <Typography>
                        {t(`Ticket Quantity (${selectedLang}) `)}
                        {index + 1}
                      </Typography>

                      {/* <Typography>Ticket Quantity {index + 1}</Typography> */}
                      <TextField
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                        fullWidth
                        margin="normal"
                      />
                    </Box>
                  ))}
                </Grid>
              </Grid>

              <Button
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
              >
                Add Contest
              </Button>
            </Box>
          </Paper>
        </Container>
      </div>
    </>
  );
};

export default EditContest;
