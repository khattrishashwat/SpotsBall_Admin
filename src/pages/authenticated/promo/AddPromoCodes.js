import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import httpClient from "../../../util/HttpClient"; // Adjust the import path based on your project structure
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

    // Validation: Ensure maxTickets > minTickets
    if (parseInt(maxTickets) <= parseInt(minTickets)) {
      setMessage("Max Tickets must be greater than Min Tickets.");
      setLoading(false);
      return;
    }

    await httpClient
      .post("admin/discount/add-discount", {
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
        navigate(-1); // Go back to the previous page
      })
      .catch((err) => {
        console.log("error => ", err);
        setMessage(err?.response?.data?.message || "Something went wrong!");
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
              Create a New Discount Coupons
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <span>Name</span>
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <span>Minimum Tickets</span>
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                value={minTickets}
                onChange={(e) => setMinTickets(e.target.value)}
                required
                type="number"
              />
              <span>Maximum Tickets</span>
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                value={maxTickets}
                onChange={(e) => setMaxTickets(e.target.value)}
                required
                type="number"
              />
              <span>Discount Percentage</span>
              <TextField
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
                sx={{
                  mt: 4,
                  mb: 4,
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

export default AddPromoCodes;
