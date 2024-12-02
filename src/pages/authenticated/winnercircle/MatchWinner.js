import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import "./MatchWinner.css"; // External CSS for Swal styling

const MatchWinner = () => {
  const [banner, setBanner] = useState(null); // For displaying original image
  const [winnerCoordinates, setWinnerCoordinates] = useState(""); // Winner coordinates field
  const [userParticipated, setUserParticipated] = useState([]); // Participants list
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  // Handle winner coordinates change
  const handleWinnerCoordinatesChange = (e) =>
    setWinnerCoordinates(e.target.value);

  // Add match and calculate winner
  const handleAddMatch = () => {
    setIsLoading(true);

    httpClient
      .post(`/api/v1/admin/contest/calculate-winner/${params.id}`)
      .then((res) => {
        setIsLoading(false);

        if (res.status) {
          const winnerData = res.data.data[0]; // Assuming there's only one winner
          showWinnerPopup(winnerData);
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

  // Show the winner's details in a Swal popup
  const showWinnerPopup = (winnerData) => {
    Swal.fire({
      title: `Congratulations, ${winnerData.userId.first_name}!`,
      text: `You have won ₹${winnerData.prize}`,
      imageUrl: winnerData.userId.profile_url,
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: "User Profile Image",
      html: `
    <div style="text-align: center;">
      <h3>Prize: ₹${winnerData.prize}</h3>
      <p><strong>User: </strong>${winnerData.userId.first_name} ${winnerData.userId.last_name}</p>
      <p><strong>Email: </strong>${winnerData.userId.email}</p>
      <p><strong>Phone: </strong>${winnerData.userId.phone}</p>
    </div>
  `,
      confirmButtonText: "Ok",
      showCloseButton: true,
      customClass: {
        popup: "custom-popup", // You can define custom styles here
        animation: "animate__animated animate__fadeIn", // Optional animation
      },
      didOpen: () => {
        const imageElement = document.querySelector(".swal2-popup img");

        if (imageElement) {
          imageElement.style.position = "relative";
          imageElement.style.zIndex = "1";
          imageElement.style.marginTop = "60px"; 
          imageElement.style.borderRadius = "50%"; 
        }
      },
    });
  };

  // Fetch contest details when component mounts
  useEffect(() => {
    httpClient
      .get(`api/v1/admin/contest/get-contest-details/${params.id}`)
      .then((res) => res.data.data)
      .then((result) => {
        setIsLoading(false);

        const contestData = result?.contest || {};

        setBanner(contestData.player_image?.file_url || "");
        setWinnerCoordinates(
          contestData.winning_coordinates
            ? `${contestData.winning_coordinates.x}, ${contestData.winning_coordinates.y}`
            : ""
        );
        setUserParticipated(result?.usersParticipated || 0);
      })
      .catch((err) => {
        setIsLoading(false);
       
      });
  }, [params.id]);

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
          {isLoading && <Loader />}
          {!isLoading && (
            <Box sx={{ display: "flex", mt: 4, width: "100%" }}>
              {/* Left Section: Banner Image and Winner Coordinates */}
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
                <label>Winner Coordinates</label>
                <TextField
                  value={winnerCoordinates}
                  fullWidth
                  margin="normal"
                  placeholder="Enter winner coordinates"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>

              {/* Right Section: List of Participated Users */}
              <Box sx={{ width: "50%", pl: 2 }}>
                <Typography variant="h6">Users Participated</Typography>
                {Array.isArray(userParticipated) &&
                userParticipated.length > 0 ? (
                  <ul>
                    {userParticipated.map((user, index) => (
                      <li key={index}>{user}</li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body1">
                    {typeof userParticipated === "number"
                      ? `${userParticipated} users participated`
                      : "No users participated yet."}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* Center Section: Add Match Button */}
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
