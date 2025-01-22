import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import "./MatchWinner.css";

const MatchWinner = () => {
  const [banner, setBanner] = useState(null);
  const [winnerCoordinates, setWinnerCoordinates] = useState("");
  const [userParticipated, setUserParticipated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleWinnerCoordinatesChange = (e) =>
    setWinnerCoordinates(e.target.value);

  const handleAddMatch = () => {
    setIsLoading(true);

    httpClient
      .post(`admin/contest/calculate-winner/${id}`)
      .then((res) => {
        setIsLoading(false);

        if (res.status) {
          const winnersData = res.data.data; // Assuming this contains all winners
          showWinnerPopup(winnersData);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        const errorMessage = err.response
          ? err.response.data.message
          : err.message;

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
        });
        console.error("Error fetching winner:", err);
      });
  };

  // const handleAddMatch = () => {
  //   setIsLoading(true);

  //   httpClient
  //     .post(`admin/contest/calculate-winner/${id}`)
  //     .then((res) => {
  //       setIsLoading(false);
  //       if (res.status && res.data.data.length) {
  //         showWinnerPopup(res.data.data);
  //       }
  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Oops...",
  //         text: err.response?.data?.message || err.message,
  //       });
  //     });
  // };

  // const showWinnerPopup = (winnersData) => {
  //   const winnersHtml = winnersData
  //     .map(
  //       (winner) => `
  //     <div style="text-align: center; margin-bottom: 20px;">
  //       <img
  //         src="${winner.userId.profile_url}"
  //         alt="User Profile Image"
  //         style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;"
  //       />
  //       <h3>${winner.userId.first_name} ${winner.userId.last_name}</h3>
  //       <p><strong>Prize:</strong> ₹${winner.prize}</p>
  //       <p><strong>Email:</strong> ${winner.userId.email}</p>
  //     </div>
  //   `
  //     )
  //     .join("");

  //   Swal.fire({
  //     title: "Congratulations to the Winners!",
  //     html: `<div style="max-height: 400px; overflow-y: auto;">${winnersHtml}</div>`,
  //     confirmButtonText: "Ok",
  //     showCloseButton: true,
  //     customClass: {
  //       popup: "custom-popup",
  //     },
  //   });
  // };

  // Show the winner(s) details in a Swal popup

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

  useEffect(() => {
    httpClient
      .get(`admin/contest/get-contest-details/${id}`)
      .then((res) => {
        const contestData = res.data?.data?.contest || {};
        setBanner(contestData.player_image?.file_url || "");
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
        <Container maxWidth="md" className="d-flex justify-content-center">
          {isLoading ? (
            <Loader />
          ) : (
            <Box sx={{ display: "flex", mt: 4, width: "100%" }}>
              <Box sx={{ width: "50%", pr: 2 }}>
                {banner && (
                  <img
                    src={banner}
                    alt="Contest Banner"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      marginBottom: "16px",
                    }}
                  />
                )}
                <Typography variant="body1">Winner Coordinates</Typography>
                <TextField
                  value={winnerCoordinates}
                  fullWidth
                  margin="normal"
                  placeholder="Enter winner coordinates"
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box sx={{ width: "50%", pl: 2 }}>
                <Typography variant="h6">Users Participated</Typography>
                {Array.isArray(userParticipated) && userParticipated.length ? (
                  <ul>
                    {userParticipated.map((user, index) => (
                      <li key={index}>{user}</li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body1">
                    No users participated yet.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          <Box sx={{ width: "100%", mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: "orange" }}
              onClick={handleAddMatch}
              disabled={isLoading}
            >
              Calculate Winner
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default MatchWinner;
