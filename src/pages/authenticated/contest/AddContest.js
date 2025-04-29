import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";

const languages = ["English", "Hindi", "Telugu", "Tamil"];

const AddContest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLang, setSelectedLang] = useState("English");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contestBanner, setContestBanner] = useState(null);
  const [playerImage, setPlayerImage] = useState(null);
  const [jackpotPrice, setJackpotPrice] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [contestStartDate, setContestStartDate] = useState("");
  const [imageWidth, setImageWidth] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const [maxTickets, setMaxTickets] = useState("");
  const [quantities, setQuantities] = useState([0, 0, 0, 0]);
  const [cousor, setCousor] = useState("");
  const { t } = useTranslation();

  // Constants for rates
  const gstRate = 28;
  const platformFeeRate = 2.5;
  const gstOnPlatformFeeRate = 18;

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const countWords = (str) => {
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const isNumeric = (value) => /^\d*$/.test(value);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const handleQuantityChange = (index, value) => {
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
        setImageWidth(img.width.toString());
        setImageHeight(img.height.toString());
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = () => {
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

        <Container maxWidth="lg">
          {isLoading && <Loader />}
          <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Add Contest
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
                    onChange={(e) => handleImageChange(e, setContestBanner)}
                  />
                  <Typography>
                    {t(`TitPlay Screen Imagele*(${selectedLang})`)}
                  </Typography>

                  <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="file"
                    onChange={handlePlayerImageChange}
                  />
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

export default AddContest;
