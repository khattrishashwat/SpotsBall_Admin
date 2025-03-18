import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import "./MatchWinner.css";
import { useTranslation } from "react-i18next";

const MatchWinner = () => {
  const [banner, setBanner] = useState(null);
  const [originalBanner, setOriginalBanner] = useState(null);
  const [winnerCoordinates, setWinnerCoordinates] = useState("");
  const [userParticipated, setUserParticipated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwapped, setIsSwapped] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  console.log("j", userParticipated);
  const { t } = useTranslation();

  useEffect(() => {
    httpClient
      .get(`admin/contest/get-contest-details/${id}`)
      .then((res) => {
        const contestData = res.data?.data?.contest || {};
        setBanner(contestData.player_image?.file_url || "");
        setOriginalBanner(contestData.original_player_image?.file_url || "");
        setWinnerCoordinates(
          contestData.winning_coordinates
            ? `${contestData.winning_coordinates.x}, ${contestData.winning_coordinates.y}`
            : ""
        );
        setUserParticipated(res.data?.data?.usersParticipated || []);
      })
      .catch(() => setIsLoading(false))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleAddMatch = () => {
    setIsLoading(true);
    httpClient
      .post(`admin/contest/calculate-winner/${id}`)
      .then((res) => {
        setIsLoading(false);
        if (res.status) {
          showWinnerPopup(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response ? err.response.data.message : err.message,
        });
      });
  };

  const showWinnerPopup = (winnersData) => {
    if (winnersData.length === 1) {
      // Single Winner
      const winner = winnersData[0];
      Swal.fire({
        title: `Congratulations, ${winner.userId.first_name}!`,
        text: `You have won ₹${winner.prize}`,
        imageUrl: winner.userId.profile_url,
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: "User Profile Image",
        html: `
        <div style="text-align: center;">
          <h3>Prize: ₹${winner.prize}</h3>
          <p><strong>User: </strong>${winner.userId.first_name} ${winner.userId.last_name}</p>
          <p><strong>Email: </strong>${winner.userId.email}</p>
       </div>
      `,
        confirmButtonText: "Ok",
        showCloseButton: true,
        customClass: {
          popup: "custom-popup",
          animation: "animate__animated animate__fadeIn",
        },
      });
    } else {
      // Multiple Winners
      const winnerHtml = winnersData
        .map(
          (winner) => `
        <div style="margin-bottom: 16px; text-align: center;">
          <img
            src="${winner.userId.profile_url}"
            alt="${winner.userId.first_name}'s Profile"
            style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px; vertical-align: middle;"
          />
          <strong>${winner.userId.first_name} ${winner.userId.last_name}</strong><br />
          <span>Prize: ₹${winner.prize}</span><br />
          <span>Email: ${winner.userId.email}</span>
        </div>
      `
        )
        .join("");

      Swal.fire({
        title: "Congratulations to all the winners!",
        html: `
        <div style="text-align: center;">
          ${winnerHtml}
        </div>
      `,
        confirmButtonText: "Ok",
        showCloseButton: true,
        customClass: {
          popup: "custom-popup",
          animation: "animate__animated animate__fadeIn",
        },
      });
    }
  };

  const swapImages = () => {
    setIsSwapped(!isSwapped);
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
          <ArrowBackIcon /> {t("Back")}
        </Button>
        <Container maxWidth="lg" className="d-flex justify-content-center">
          {isLoading ? (
            <Loader />
          ) : (
            <Box
              sx={{
                display: "flex",
                mt: 4,
                mb: 6,
                width: "100%",
                // height: "50vh",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "45%", textAlign: "center" }}>
                <Typography variant="body1">
                  {isSwapped ? t("Original Image") : t("Contest Image")}
                </Typography>
                <img
                  src={isSwapped ? originalBanner : banner}
                  alt="Contest"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                />
                <Box sx={{ width: "70%", pl: 1 }}>
                  <Typography variant="h6">
                    {t("Users Participated")}
                  </Typography>
                  {userParticipated > 0 ? (
                    <Typography variant="body1">
                      {userParticipated} {t("users participated")}
                    </Typography>
                  ) : (
                    <Typography variant="body1">
                      {t("No users participated yet.")}
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ backgroundColor: "orange", mt: 2 }}
                  onClick={handleAddMatch}
                >
                  {t("Calculate Winner")}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ backgroundColor: "red", mt: 2, ml: 2 }}
                  onClick={() => navigate("userpaticipate")}
                >
                  {t("Participation")}
                </Button>
              </Box>
              <IconButton onClick={swapImages} color="primary" sx={{ mx: 2 }}>
                <SwapHorizIcon fontSize="large" />
              </IconButton>
              <Box sx={{ width: "45%", textAlign: "center" }}>
                <Typography variant="body1">
                  {isSwapped ? t("Contest Image") : t("Original Image")}
                </Typography>
                <img
                  src={isSwapped ? banner : originalBanner}
                  alt="Original"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                />
                <Typography variant="body1">
                  {t("Winning Coordinates")}
                </Typography>
                <TextField
                  value={winnerCoordinates}
                  fullWidth
                  margin="normal"
                  placeholder={t("Enter winner coordinates")}
                  InputProps={{ readOnly: true }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, ml: 2 }}
                  onClick={() => navigate("find-coordinates")}
                >
                  {t("Find Coordinates")}
                </Button>
              </Box>
            </Box>
          )}
        </Container>
      </div>
    </>
  );
};

export default MatchWinner;
