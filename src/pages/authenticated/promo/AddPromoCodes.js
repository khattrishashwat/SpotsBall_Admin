import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import httpClient from "../../../util/HttpClient"; // Ensure this path is correct based on your project structure
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";

const AddPromoCodes = () => {
  const [name, setName] = useState("");
  const [minTickets, setMinTickets] = useState("");
  const [maxTickets, setMaxTickets] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    await httpClient
      .post("api/v1/admin/discount/add-discount", {
        name,
        minTickets,
        maxTickets,
        discountPercentage,
      })
      .then((res) => {
        setMessage("Promo code created successfully!");
        setName("");
        setMinTickets("");
        setMaxTickets("");
        setDiscountPercentage("");
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
              Create a New Promo Code
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                label="Minimum Tickets"
                variant="outlined"
                fullWidth
                margin="normal"
                value={minTickets}
                onChange={(e) => setMinTickets(e.target.value)}
                required
                type="number"
              />
              <TextField
                label="Maximum Tickets"
                variant="outlined"
                fullWidth
                margin="normal"
                value={maxTickets}
                onChange={(e) => setMaxTickets(e.target.value)}
                required
                type="number"
              />
              <TextField
                label="Discount Percentage"
                variant="outlined"
                fullWidth
                margin="normal"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                required
                type="number"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
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

export default AddPromoCodes;
