import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";

const EditPromoCodes = () => {
  const [name, setName] = useState("");
  const [minTickets, setMinTickets] = useState("");
  const [maxTickets, setMaxTickets] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  let params = useParams();
  let navigate = useNavigate();

  const handleSubmit = () => {
    setMessage("");
    setIsLoading(true);

    // Validation: Ensure maxTickets > minTickets
    if (parseInt(maxTickets) <= parseInt(minTickets)) {
      setMessage("Max Tickets must be greater than Min Tickets.");
      setIsLoading(false);
      return;
    }

    httpClient
      .patch(`admin/discount/edit-discount/${params.id}`, {
        name,
        minTickets,
        maxTickets,
        discountPercentage,
      })
      .then(() => {
        setIsLoading(false);
        navigate(-1); // Go back to the previous page
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        setMessage("Failed to update the promo code. Please try again.");
      });
  };

  useEffect(() => {
    httpClient
      .get(`admin/discount/get-discount-by-id/${params.id}`)
      .then((res) => {
        const data = res.data.data;
        setName(data.name);
        setMinTickets(data.minTickets);
        setMaxTickets(data.maxTickets);
        setDiscountPercentage(data.discountPercentage);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        setMessage("Failed to load promo code details.");
      });
  }, [params.id]);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Update Promo Code" />

        <Container maxWidth="sm">
          {isLoading && <Loader />}
          {!isLoading && (
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
              {message && (
                <Typography
                  variant="body2"
                  color={message.includes("Failed") ? "red" : "green"}
                  sx={{ mb: 2 }}
                >
                  {message}
                </Typography>
              )}
              <span>Name</span>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <span>Minimum Tickets</span>
              <TextField
                value={minTickets}
                onChange={(e) => setMinTickets(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                type="number"
              />
              <span>Maximum Tickets</span>
              <TextField
                value={maxTickets}
                onChange={(e) => setMaxTickets(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                type="number"
              />
              <span>Discount Percentage</span>
              <TextField
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                type="number"
              />
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
              >
                Update
              </Button>
            </Box>
          )}
        </Container>
      </div>
    </>
  );
};

export default EditPromoCodes;
