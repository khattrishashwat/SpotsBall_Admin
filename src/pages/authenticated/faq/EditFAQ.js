import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";

const languages = ["English", "Hindi", "Telugu", "Tamil"];

const EditFAQ = () => {
  const [faqData, setFaqData] = useState({
    English: { question: "", answer: "" },
    Hindi: { question: "", answer: "" },
    Telugu: { question: "", answer: "" },
    Tamil: { question: "", answer: "" },
  });
  const [selectedLang, setSelectedLang] = useState("English");
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();
  let navigate = useNavigate();

  const handleQuestionChange = (e) => {
    setFaqData((prev) => ({
      ...prev,
      [selectedLang]: { ...prev[selectedLang], question: e.target.value },
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const { question, answer } = faqData[selectedLang];
    httpClient
      .patch(`admin/faq/edit-faq/${params.id}`, {
        language: selectedLang,
        question,
        answer,
      })
      .then(() => {
        setIsLoading(false);
        navigate(-1);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Error updating FAQ:", err);
      });
  };

  useEffect(() => {
    httpClient
      .get(`admin/faq/get-faq/${params.id}`)
      .then((res) => {
        // Assuming API returns `language`, `question`, `answer`
        const fetched = res.data.data;
        setFaqData((prev) => ({
          ...prev,
          [fetched.language]: {
            question: fetched.question,
            answer: fetched.answer,
          },
        }));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Error fetching FAQ:", err);
      });
  }, [params.id]);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Update FAQ" />

        <Container maxWidth="sm">
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
            {/* Language Buttons */}
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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

            <TextField
              label={`Question (${selectedLang})`}
              value={faqData[selectedLang].question}
              onChange={handleQuestionChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                sx: { marginTop: "6px" },
              }}
            />

            <Typography variant="h6" sx={{ mt: 2 }}>
              Answer ({selectedLang}):
            </Typography>
            <CKEditor
              editor={ClassicEditor}
              data={faqData[selectedLang].answer}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFaqData((prev) => ({
                  ...prev,
                  [selectedLang]: { ...prev[selectedLang], answer: data },
                }));
              }}
            />

            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                backgroundColor: "orange",
                width: "100%",
              }}
              onClick={handleSubmit}
            >
              {isLoading ? "Updating..." : `Update ${selectedLang} FAQ`}
            </Button>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default EditFAQ;
