import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import httpClient from "../../../util/HttpClient";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const languages = ["English", "Hindi", "Telugu", "Tamil"];

const AddFAQ = () => {
  const [selectedLang, setSelectedLang] = useState("English");
  const [formData, setFormData] = useState({
    English: { question: "", answer: "" },
    Hindi: { question: "", answer: "" },
    Telugu: { question: "", answer: "" },
    Tamil: { question: "", answer: "" },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (lang, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any language is missing question or answer
    const missingFields = languages.filter(
      (lang) => !formData[lang].question || !formData[lang].answer
    );

    if (missingFields.length) {
      setMessage(
        `Please fill Question and Answer for: ${missingFields.join(", ")}`
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await httpClient.post("admin/faq/add-faq", {
        faqs: formData,
      });

      setMessage("FAQ created successfully!");
      setFormData({
        English: { question: "", answer: "" },
        Hindi: { question: "", answer: "" },
        Telugu: { question: "", answer: "" },
        Tamil: { question: "", answer: "" },
      });
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
        <Container maxWidth="md">
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
              Create a New FAQ
            </Typography>

            {/* Language Toggle Buttons */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              {languages.map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLang === lang ? "contained" : "outlined"}
                  onClick={() => setSelectedLang(lang)}
                >
                  {lang}
                </Button>
              ))}
            </Stack>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                label={`Question (${selectedLang})`}
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData[selectedLang].question}
                onChange={(e) =>
                  handleInputChange(selectedLang, "question", e.target.value)
                }
                required
                InputLabelProps={{
                  sx: { marginTop: "6px" },
                }}
              />

              <Typography variant="h6" sx={{ mt: 2 }}>
                Answer ({selectedLang}):
              </Typography>
              <CKEditor
                editor={ClassicEditor}
                data={formData[selectedLang].answer}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleInputChange(selectedLang, "answer", data);
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
