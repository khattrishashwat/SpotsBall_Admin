import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditGroup = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  const handleNameChange = (e) => setName(e.target.value);
  const handleColorChange = (e) => setColor(e.target.value);
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = () => {
    setIsLoading(true);
    let formData = new FormData();

    formData.append("name", name);
    if (image) formData.append("thumbnail", image);
    formData.append("color", color);

    addGroupToDB(formData);
  };

  const addGroupToDB = (groupData) => {
    httpClient
      .put(`/admin/update-group/${params.id}`, groupData)
      .then((res) => res.data)
      .then((data) => {
        if (data.status) {
          setIsLoading(false);
          navigate(-1);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("error => ", err);
      });
  };

  useEffect(() => {
    httpClient
      .get(`/admin/get-group/${params.id}`)
      .then((res) => res?.data?.result[0])
      .then((result) => {
        // setData(result);
        setIsLoading(false);
        setName(result.name);
        // setImage(result.thumbnail);
        setColor(result.color);
      })
      .catch((err) => {
        console.log("axios error => ", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2, ml: 16 }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIcon />
          back
        </Button>
        <Container maxWidth="sm " className="d-flex justify-content-center">
          {isLoading && <Loader />}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ mt: 4, width: "80%" }}
          >
            <label>Name</label>
            <TextField
              // label="Name"
              value={name}
              onChange={handleNameChange}
              fullWidth
              margin="normal"
              placeholder="Party, Picnic, Birthday, Love, Romance..."
              sx={{
                border: "none",
              }}
            />
            <label className="mt-4">Thumbnail</label>
            <TextField
              onChange={handleImageChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
              //   value={image}
            />
            <label className="me-2">Color : </label>
            <input
              className="mt-4"
              value={color}
              type="text"
              placeholder="#000000"
              onChange={handleColorChange}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 8, ml: 2, display: "block", backgroundColor: "orange" }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Update
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EditGroup;
