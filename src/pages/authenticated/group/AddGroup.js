import React, { useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddGroup = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [image, setImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleNameChange = (e) => setName(e.target.value);
  const handleColorChange = (e) => setColor(e.target.value);
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = () => {
    setIsLoading(true);
    let formData = new FormData();

    formData.append("name", name);
    formData.append("thumbnail", image);
    formData.append("color", color);

    addGroupToDB(formData);
  };

  const addGroupToDB = (groupData) => {
    httpClient
      .post(`/admin/add-group`, groupData)
      .then((res) => res.data)
      .then((data) => {
        if (data.status) {
          setIsLoading(false);
          navigate(-1);
        }
      }).catch(err => {
        setIsLoading(false);
        console.log("error => ", err)
      })
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2, ml: 16}}
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
            ></TextField>
            <label className="mt-4">Thumbnail</label>
            <TextField
              onChange={handleImageChange}
              fullWidth
              margin="normal"
              variant="outlined"
              type="file"
            />
            <label className="me-2">Color : </label>
            <input
              className="mt-4"
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
              Add Group
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AddGroup;
