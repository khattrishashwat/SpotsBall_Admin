import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";
import httpClient from "../../../util/HttpClient"; // Ensure this path is correct based on your project structure
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import { State } from "country-state-city"; // Import State from the package

const AddRestricted = () => {
  const [state, setState] = useState("");
  const [statesList, setStatesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  let navigate = useNavigate();

  // Load Indian states on component mount
  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN"); // Fetch states of India using country code "IN"
    setStatesList(indianStates);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Check if a state is selected
    if (!state.trim()) {
      setMessage("State is required and cannot be empty.");
      setLoading(false);
      return;
    }

    await httpClient
      .post("api/v1/admin/restricted-states/add-restricted-states", {
        state: state.trim(),
      })
      .then((res) => {
        setMessage("State created successfully!");
        setState("");
        navigate(-1);
      })
      .catch((err) => {
        console.log("error => ", err);
        setMessage(err?.response?.data?.message);
        setLoading(false);
      });
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 4,
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 1,
            }}
          >
            <Typography variant="h5" component="h1" gutterBottom>
              Select State
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                select
                label="Select State"
                variant="outlined"
                fullWidth
                margin="normal"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                InputLabelProps={{
                  sx: {
                    marginTop: "6px",
                  },
                }}
              >
                {statesList.map((state) => (
                  <MenuItem key={state.isoCode} value={state.name}>
                    {state.name}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 4,
                  ml: 2,
                  mb: 4,
                  display: "block",
                  backgroundColor: "orange",
                }}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
            {message && (
              <Typography
                variant="body2"
                color={message.includes("successfully") ? "green" : "red"}
                sx={{ mt: 2 }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AddRestricted;
