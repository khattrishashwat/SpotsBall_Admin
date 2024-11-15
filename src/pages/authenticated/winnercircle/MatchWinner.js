import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const MatchWinner = () => {
  const [banner, setBanner] = useState(null); // For displaying original image
  const [winnerCoordinates, setWinnerCoordinates] = useState(""); // Winner coordinates field
  const [userParticipated, setUserParticipated] = useState([]); // Participants list (or number of users)
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  const handleWinnerCoordinatesChange = (e) =>
    setWinnerCoordinates(e.target.value);

  const handleAddMatch = () => {
    setIsLoading(true);

    // const matchData = {
    //   contest_id: params.id, // Use the contest ID from params
    //   winnerCoordinates,
    // };

    // Use template literal to include params.id in the URL
    httpClient
      .post(`/api/v1/admin/contest/calculate-winner/${params.id}`)

      .then((res) => {
        console.log("log", res);

        if (res.status) {
          setIsLoading(false);
          navigate("/winner"); // Replace with the target page on successful post
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("error =>", err);
      });
  };

  useEffect(() => {
    // Fetch data by contest ID
    httpClient
      .get(`api/v1/admin/contest/get-contest-details/${params.id}`)
      .then((res) => res.data.data) // Access the entire response data directly
      .then((result) => {
        setIsLoading(false);

        const contestData = result?.contest || {};

        // Set the banner image URL
        setBanner(contestData.player_image?.file_url || "");

        // Set the winner coordinates as a string (e.g., "1, 123")
        const winnerCoords = contestData.winning_coordinates
          ? `${contestData.winning_coordinates.x}, ${contestData.winning_coordinates.y}`
          : "";
        setWinnerCoordinates(winnerCoords);

        // Set the number of users who participated (or an empty array if needed)
        setUserParticipated(result?.usersParticipated || 0); // This can be a number, adjust if needed
      })
      .catch((err) => {
        console.error("axios error =>", err);
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
          back
        </Button>
        <Container maxWidth="md" className="d-flex justify-content-center">
          {isLoading && <Loader />}
          {!isLoading && (
            <Box sx={{ display: "flex", mt: 4, width: "100%" }}>
              {/* Left Section: Original Image and Winner Coordinates */}
              <Box sx={{ width: "50%", pr: 2 }}>
                {banner && (
                  <img
                    src={banner} // Display the original banner image
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
                  onChange={handleWinnerCoordinatesChange}
                  fullWidth
                  margin="normal"
                  placeholder="Enter winner coordinates"
                />
              </Box>

              {/* Right Section: List of Participated Users */}
              <Box sx={{ width: "50%", pl: 2 }}>
                <Typography variant="h6">User Participated</Typography>
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
              Add Match
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default MatchWinner;
