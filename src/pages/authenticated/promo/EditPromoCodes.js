import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
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

  let params = useParams();
  let navigate = useNavigate();

  const handleSubmit = () => {
    setIsLoading(true);
    httpClient
      .patch(`api/v1/admin/discount/edit-discount/${params.id}`, {
        name,
        minTickets,
        maxTickets,
        discountPercentage,
      })
      .then(() => {
        setIsLoading(false);
        navigate(-1);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    httpClient
      .get(`api/v1/admin/discount/get-discount-by-id/${params.id}`)
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
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <TextField
                label="Minimum Tickets"
                value={minTickets}
                onChange={(e) => setMinTickets(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                type="number"
              />
              <TextField
                label="Maximum Tickets"
                value={maxTickets}
                onChange={(e) => setMaxTickets(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                type="number"
              />
              <TextField
                label="Discount Percentage"
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
                sx={{ mb: 3, mt: 2 }}
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
