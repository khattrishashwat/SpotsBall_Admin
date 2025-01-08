import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditCouponsCodes = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  let params = useParams();
  let navigate = useNavigate();
  console.log("meessage", message);

  // const handleSubmit = () => {
  //   setMessage("");
  //   setIsLoading(true);

  //   httpClient
  //     .patch(`api/v1/admin/promocode/edit-promocode/${params.id}`, {
  //       name,
  //       amount,
  //     })
  //     .then(() => {
  //               setMessage();

  //       setIsLoading(false);
  //       navigate(-1); // Go back to the previous page
  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //       console.error(err);
  //       setMessage();
  //     });
  // };

  const handleSubmit = () => {
    setIsLoading(true);

    httpClient
      .patch(`api/v1/admin/promocode/edit-promocode/${params.id}`, {
        name,
        amount,
      })
      .then((response) => {
        setIsLoading(false);
        setMessage(response.data.message);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message ,
          showConfirmButton:false,
          timer: 1500,
        });
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
      .get(`api/v1/admin/promocode/get-promocode-by-id/${params.id}`)
      .then((res) => {
        const data = res.data.data;
        setName(data.name);
        setAmount(data.amount);

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
        <PageTitle title="Update Coupons" />

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
              <span>Amount</span>
              <TextField
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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

export default EditCouponsCodes;
