import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import httpClient from "../../../util/HttpClient"; // Ensure this path is correct based on your project structure
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddFAQ = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !answer) {
      setMessage("Both Question and Answer are required!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await httpClient.post("admin/faq/add-faq", {
        question,
        answer,
      });
      setMessage("Question created successfully!");
      setQuestion("");
      setAnswer("");
      navigate(-1);
    } catch (err) {
      console.error("Error =>", err);
      setMessage(
        err?.response?.data?.message || "An error occurred. Please try again."
      );
      setLoading(false);
    }
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
              Create a New Question
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                label="Question"
                variant="outlined"
                fullWidth
                margin="normal"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                InputLabelProps={{
                  sx: { marginTop: "6px" },
                }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Answer:
              </Typography>
              <CKEditor
                editor={ClassicEditor}
                data={answer}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setAnswer(data);
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 4, mb: 4 }}
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

export default AddFAQ;
