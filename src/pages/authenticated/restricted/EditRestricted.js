import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditRestricted = () => {
  const [state, setState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  let navigate = useNavigate();
  let params = useParams();

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("");

    if (!state) {
      setMessage("State is required.");
      setIsLoading(false);
      return;
    }

    const updatedState = { state };

    httpClient
      .patch(
        `api/v1/admin/restricted-states/edit-restricted-states/${params.id}`,
        updatedState
      )
      .then((res) => {
        console.log("Updated state => ", res);
        setIsLoading(false);
        navigate(-1);
      })
      .catch((err) => {
        console.log("Error => ", err);
        setMessage("Failed to update the state.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    httpClient
      .get(
        `api/v1/admin/restricted-states/get-restricted-states-by-id/${params.id}`
      )
      .then((res) => {
        const result = res.data.data; // Correctly access the `data` property
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
            <TextField
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              InputLabelProps={{
                sx: { marginTop: "5px" },
              }}
            />
            {message && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
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
