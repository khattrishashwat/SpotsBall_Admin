import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import httpClient from "../../../util/HttpClient"; // Ensure this path is correct based on your project structure
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";

const AddSocials = () => {
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Check if URL is empty or invalid
    if (!url) {
      setMessage("URL is required.");
      setLoading(false);
      return;
    }

    // Simple URL validation (you can improve this if needed)
    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!urlPattern.test(url)) {
      setMessage("Please enter a valid URL.");
      setLoading(false);
      return;
    }

    await httpClient
      .post("admin/live-links/add-live-links", {
        type,
        url,
      })
      .then((res) => {
        setMessage("Social link created successfully!");
        setType("");
        setUrl("");
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
              Create Social Link
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                label="Type"
                variant="outlined"
                fullWidth
                margin="normal"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                InputLabelProps={{
                  sx: {
                    marginTop: "6px",
                  },
                }}
              />
              <TextField
                label="URL"
                variant="outlined"
                fullWidth
                margin="normal"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                type="url"
                InputLabelProps={{
                  sx: {
                    marginTop: "8px",
                  },
                }}
              />
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

export default AddSocials;
