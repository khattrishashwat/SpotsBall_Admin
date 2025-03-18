import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
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

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contestBanner, setContestBanner] = useState(null);
  const [playerImage, setPlayerImage] = useState(null);
  const [jackpotPrice, setJackpotPrice] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [contestStartDate, setContestStartDate] = useState("");
  const [original_player_image, setOriginal_player_image] = useState("");
  const [imageWidth, setImageWidth] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const [maxTickets, setMaxTickets] = useState("");
  const [quantities, setQuantities] = useState([0, 0, 0, 0]);
  const [cousor, setCousor] = useState("");

  // Constants for rates
  const gstRate = 28;
  const platformFeeRate = 2.5;
  const gstOnPlatformFeeRate = 18;

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Helper to count words
  const countWords = (str) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  // For numeric fields, we use a RegExp to allow only digits.
  const isNumeric = (value) => /^\d*$/.test(value);

  // Validations for individual fields.
  // NOTE: These functions now are used in the submit handler (and to show helperText)
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value.trim()) error = "Title is required";
        else if (countWords(value) > 150)
          error = "Title must not exceed 150 words";
        break;
      case "description":
        if (!value.trim()) error = "Description is required";
        else if (countWords(value) > 200)
          error = "Description must not exceed 200 words";
        break;
      case "jackpotPrice":
        if (!value.trim()) error = "Jackpot Price is required";
        else if (!isNumeric(value)) error = "Jackpot Price must be numeric";
        else if (value.length < 1 || value.length > 5)
          error = "Jackpot Price must be between 1 and 5 digits";
        break;
      case "ticketPrice":
        if (!value.trim()) error = "Ticket Price is required";
        else if (!isNumeric(value)) error = "Ticket Price must be numeric";
        else if (value.length < 1 || value.length > 5)
          error = "Ticket Price must be between 1 and 5 digits";
        break;
      case "contestStartDate":
        if (!value.trim()) error = "Contest Start Date is required";
        break;
      case "imageWidth":
        if (!value.trim()) error = "Image Width is required";
        else if (isNaN(value)) error = "Image Width must be a number";
        break;
      case "imageHeight":
        if (!value.trim()) error = "Image Height is required";
        else if (isNaN(value)) error = "Image Height must be a number";
        break;
      case "maxTickets":
        if (!value.trim()) error = "Max Tickets is required";
        else if (!isNumeric(value)) error = "Max Tickets must be numeric";
        else if (value.length < 1 || value.length > 3)
          error = "Max Tickets must be between 1 and 3 digits";
        break;
      case "cousor":
        if (!value.trim()) error = "Cursor color is required";
        break;
      default:
        break;
    }
    return error;
  };

  // Handler for Title (word limit: 150 words)
  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (countWords(value) <= 150) {
      setTitle(value);
      setErrors((prev) => ({ ...prev, title: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        title: "Title must not exceed 150 words",
      }));
    }
  };

  // Handler for Description (word limit: 200 words)
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (countWords(value) <= 200) {
      setDescription(value);
      setErrors((prev) => ({ ...prev, description: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        description: "Description must not exceed 200 words",
      }));
    }
  };

  // General handler for other fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    // For numeric fields (jackpotPrice, ticketPrice, maxTickets) allow only digits.
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
        if (value.length <= 5) {
          setJackpotPrice(value);
          setErrors((prev) => ({ ...prev, jackpotPrice: "" }));
        }
        break;
      case "ticketPrice":
        if (value.length <= 5) {
          setTicketPrice(value);
          setErrors((prev) => ({ ...prev, ticketPrice: "" }));
        }
        break;
      case "contestStartDate":
        setContestStartDate(value);
        setErrors((prev) => ({ ...prev, contestStartDate: "" }));
        break;
      case "maxTickets":
        if (value.length <= 3) {
          setMaxTickets(value);
          setErrors((prev) => ({ ...prev, maxTickets: "" }));
        }
        break;
      case "cousor":
        setCousor(value);
        setErrors((prev) => ({ ...prev, cousor: "" }));
        break;
      default:
        break;
    }
  };

  // Handler for quantities that only allows positive integers (no negative or decimals)
  const handleQuantityChange = (index, value) => {
    // Only allow digits and ensure it doesn't start with zero unless it's exactly "0"
    if (/^(0|[1-9]\d*)?$/.test(value)) {
      const updatedQuantities = [...quantities];
      updatedQuantities[index] = value;
      setQuantities(updatedQuantities);
    }
  };

  const validateImage = (file) => {
    const allowedTypes = ["image/png", "image/jpeg"];
    if (!file || !allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Only PNG and JPEG images are allowed.",
      });
      return false;
    }
    return true;
  };

  const handleImageChange = (e, setImageState) => {
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
        // Auto-populate and disable editing of these fields
        setImageWidth(img.width.toString());
        setImageHeight(img.height.toString());
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = () => {
    // Validate all fields before submitting using our validateField function.
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

    Object.keys(newErrors).forEach(
      (key) => !newErrors[key] && delete newErrors[key]
    );

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

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
    // formData.append("original_player_image", original_player_image);
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
      .post(`admin/contest/add-contest`, groupData)
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
          Back
        </Button>

        {/* <Container maxWidth="xl" className="d-flex justify-content-center">
          {isLoading && <Loader />}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ mt: 4, width: "80%" }}
          >
            <label>Title</label>
            <TextField
              name="title"
              value={title}
              onChange={handleTitleChange}
              fullWidth
              margin="normal"
              placeholder="Enter contest title"
              error={!!errors.title}
              helperText={errors.title}
            />

            <label>Description</label>
            <TextField
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              margin="normal"
              placeholder="Enter contest description"
              error={!!errors.description}
              helperText={errors.description}
            />


            <label>Jackpot Price</label>
            <TextField
              name="jackpotPrice"
              value={jackpotPrice}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="Enter jackpot price"
              error={!!errors.jackpotPrice}
              helperText={errors.jackpotPrice}
              inputProps={{ maxLength: 5 }}
            />

            <label>Ticket Price</label>
            <TextField
              name="ticketPrice"
              value={ticketPrice}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="Enter ticket price"
              error={!!errors.ticketPrice}
              helperText={errors.ticketPrice}
              inputProps={{ maxLength: 5 }}
            />

            <label>Contest Start Date</label>
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
                inputProps: { min: new Date().toISOString().slice(0, 16) },
              }}
            />

            <label>Contest Banner Image</label>
            <TextField
              onChange={(e) => handleImageChange(e, setContestBanner)}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
            />
            <label>Play Screen Image</label>
            <TextField
              onChange={handlePlayerImageChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
            />

            <label>Image Width</label>
            <TextField
              name="imageWidth"
              value={imageWidth}
              fullWidth
              margin="normal"
              placeholder="Image width auto-populated"
              disabled
              error={!!errors.imageWidth}
              helperText={errors.imageWidth}
            />

            <label>Image Height</label>
            <TextField
              name="imageHeight"
              value={imageHeight}
              fullWidth
              margin="normal"
              placeholder="Image height auto-populated"
              disabled
              error={!!errors.imageHeight}
              helperText={errors.imageHeight}
            />

            <label>Max Tickets</label>
            <TextField
              name="maxTickets"
              value={maxTickets}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="Enter max ticket count"
              error={!!errors.maxTickets}
              helperText={errors.maxTickets}
              inputProps={{ maxLength: 3 }}
            />

            <label>Ticket Quantities</label>
            {quantities.map((quantity, index) => (
              <TextField
                key={index}
                value={quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                fullWidth
                margin="normal"
                placeholder={`Enter quantity for ticket type ${index + 1}`}
              />
            ))}

            <label>GST Rate</label>
            <TextField fullWidth margin="normal" value={gstRate} disabled />

            <label>Platform Fee Rate</label>
            <TextField
              fullWidth
              margin="normal"
              value={platformFeeRate}
              disabled
            />

            <label>GST on Platform Fee Rate</label>
            <TextField
              fullWidth
              margin="normal"
              value={gstOnPlatformFeeRate}
              disabled
            />

            <label>Choose Cursor Color</label>
            <TextField
              name="cousor"
              value={cousor}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="Enter Cursor Color"
              error={!!errors.cousor}
              helperText={errors.cousor}
            />

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
        </Container> */}

        <Container maxWidth="lg">
          {isLoading && <Loader />}
          <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Add Contest
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={4}>
                {/* Left Side Fields */}
                <Grid item xs={12} md={6}>
                  <Typography>Title</Typography>
                  <TextField
                    name="title"
                    value={title}
                    onChange={handleTitleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.title}
                    helperText={errors.title}
                  />
                  <Typography>Description</Typography>
                  <TextField
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                  <Typography>Jackpot Price</Typography>
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
                  <Typography>Ticket Price</Typography>
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
                  <Typography>Contest Start Date</Typography>
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
                  <Typography>Max Tickets</Typography>
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
                  <Typography>Choose Cursor Color</Typography>
                  <TextField
                    name="cousor"
                    value={cousor}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.cousor}
                    helperText={errors.cousor}
                  />
                  <Typography>GST Rate</Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    value={gstRate}
                    disabled
                  />
                  <Typography>Platform Fee Rate</Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    value={platformFeeRate}
                    disabled
                  />
                  <Typography>GST on Platform Fee Rate</Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    value={gstOnPlatformFeeRate}
                    disabled
                  />
                </Grid>

                {/* Right Side Fields */}
                <Grid item xs={12} md={6}>
                  <Typography>Contest Banner Image</Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="file"
                    onChange={(e) => handleImageChange(e, setContestBanner)}
                  />
                  <Typography>Play Screen Image</Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="file"
                    onChange={handlePlayerImageChange}
                  />
                  <Typography>Image Width</Typography>
                  <TextField
                    name="imageWidth"
                    value={imageWidth}
                    fullWidth
                    margin="normal"
                    disabled
                    error={!!errors.imageWidth}
                    helperText={errors.imageWidth}
                  />
                  <Typography>Image Height</Typography>
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
                      <Typography>Ticket Quantity {index + 1}</Typography>
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

export default AddContest;
