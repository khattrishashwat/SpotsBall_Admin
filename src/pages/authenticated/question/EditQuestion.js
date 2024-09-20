import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditQuestion = () => {
  const [type, setQuestionType] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();
  let params = useParams();

  const handleQuestionTypeChange = (e) => setQuestionType(e.target.value);
  const handleQuestionChange = (e) => setQuestion(e.target.value);
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const newQuestion = {
      type,
      question,
      options,
    };
    updateQuestion(newQuestion);
    console.log(question, type, options);
    setSubmittedQuestions([...submittedQuestions, newQuestion]);
    setQuestionType("");
    setQuestion("");
    setOptions(["", ""]);
  };

  const updateQuestion = (newQuestion) => {
    httpClient
      .put(`/admin/update-question/${params.id}`, newQuestion)
      .then((res) => {
        console.log("update question => ", res);
        setIsLoading(false);
        navigate(-1);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("error => ", err);
      });
  };

  useEffect(() => {
    httpClient
      .get(`/admin/get-question/${params.id}`)
      .then((res) => res.data.result[0])
      .then((result) => {
        console.log("edit question => ", result);
        setQuestionType(result.type);
        setQuestion(result.question);
        setOptions(result.options);
      })
      .catch((err) => {
        console.log("edit question error => ", err);
      });
  }, []);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Container maxWidth="sm">
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2, ml:0}}
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBackIcon />
            back
          </Button>
          {isLoading && <Loader />}
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
            <TextField
              select
              label="Select Question Type"
              value={type}
              onChange={handleQuestionTypeChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                sx: {
                  // fontSize: "18px", // Example: Set custom font size
                  marginTop:"5px"
                },
              }}
            >
              <MenuItem value="1">Primary</MenuItem>
              <MenuItem value="2">Extra</MenuItem>
              {/* <MenuItem value="short-answer">Short Answer</MenuItem> */}
            </TextField>
            <TextField
              // label="Question"
              placeholder="Question"
              value={question}
              onChange={handleQuestionChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            {options.map((option, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", mt: 2 }}
              >
                <TextField
                  // label={`Option ${index + 1}`}
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <IconButton
                  onClick={() => handleRemoveOption(index)}
                  disabled={options.length <= 2}
                >
                  <Remove />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleAddOption}
              disabled={options.length >= 4}
            >
              <Add /> Add Option
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, ml: 2 }}
              onClick={handleSubmit}
            >
              Update Question
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EditQuestion;
