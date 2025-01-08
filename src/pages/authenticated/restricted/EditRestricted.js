import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { State } from "country-state-city";

const EditRestricted = () => {
  const [state, setState] = useState("");
  const [statesList, setStatesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  let navigate = useNavigate();
  let params = useParams();

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("");

    if (!state.trim()) {
      setMessage("Please select a state.");
      setIsLoading(false);
      return;
    }

    const updatedState = { state };

    try {
      const response = await httpClient.patch(
        `api/v1/admin/restricted-states/edit-restricted-states/${params.id}`,
        updatedState
      );
      console.log("Updated state => ", response);
      setMessage("State updated successfully!");
      setIsLoading(false);
      navigate(-1);
    } catch (err) {
      console.error("Error => ", err);
      setMessage(err?.response?.data?.message || "Failed to update the state.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch Indian states using country-state-city
    const indianStates = State.getStatesOfCountry("IN");
    setStatesList(indianStates);

    setIsLoading(true);
    httpClient
      .get(
        `api/v1/admin/restricted-states/get-restricted-states-by-id/${params.id}`
      )
      .then((res) => {
        const result = res.data.data;
        console.log("Edit state => ", result);
        setState(result.state); // Set the state from the API response
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching state data => ", err);
        setIsLoading(false);
      });
  }, [params.id]);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Container maxWidth="sm">
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2, ml: 0 }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
            Back
          </Button>
          {isLoading && <Loader />}
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              >
                {statesList.map((item) => (
                  <MenuItem key={item.isoCode} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {message && (
              <Typography
                variant="body2"
                color={message.includes("successfully") ? "green" : "red"}
                sx={{ mt: 2 }}
              >
                {message}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 4,
                ml: 2,
                mb: 4,
                display: "block",
                backgroundColor: "orange",
              }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update State"}
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EditRestricted;
