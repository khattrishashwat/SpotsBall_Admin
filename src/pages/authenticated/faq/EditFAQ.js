// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Container,
//   TextField,
//   Typography,
//   Paper,
// } from "@mui/material";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// import AppSidebar from "../../../components/AppSidebar";
// import AppHeader from "../../../components/AppHeader";
// import PageTitle from "../../common/PageTitle";
// import httpClient from "../../../util/HttpClient";
// import Loader from "../../../components/loader/Loader";
// import { useNavigate, useParams } from "react-router-dom";
// import { Padding } from "@mui/icons-material";

// const EditFAQ = () => {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [submittedQA, setSubmittedQA] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [newContent, setNewContent] = useState({});

//   let params = useParams();
//   let navigate = useNavigate();

//   const handleQuestionChange = (e) => setQuestion(e.target.value);
//   const handleAnswerChange = (e) => setAnswer(newContent);

//   const handleSubmit = () => {
//     setIsLoading(false);
//     setSubmittedQA({ question, answer });
//     setQuestion("");
//     setAnswer("");
//     httpClient
//       .patch(`admin/edit-faq/${params.id}`, { question, answer })
//       .then((res) => {
//         setIsLoading(true);
//         navigate(-1);
//       })
//       .catch((err) => {
//         setIsLoading(true);
//         console.log(err);
//       });
//   };

//   useEffect(() => {
//     httpClient.get(`admin/get-faq/${params.id}`).then((res) => {
//       setAnswer(res.data.data.answer);
//       setQuestion(res.data.data.question);
//       setIsLoading(false);
//     });
//   }, []);

//   return (
//     <>
//       <AppSidebar />
//       <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
//         <AppHeader />
//         <PageTitle title="Update FAQ" />

//         <Container maxWidth="sm">
//           {isLoading && <Loader />}
//           <Box component="form" noValidate autoComplete="off" sx={{ mt: 4 }}>
//             <TextField
//               label="Question"
//               value={question}
//               onChange={handleQuestionChange}
//               fullWidth
//               margin="normal"
//               variant="outlined"
//               InputLabelProps={{
//                 sx: {
//                   // fontSize: "18px", // Example: Set custom font size
//                   marginTop: "6px",
//                 },
//               }}
//             />
           
//             Answer:
//             <CKEditor
//               editor={ClassicEditor}
//               data={answer}
//               // onReady={editor => {
//               //     console.log('Editor is ready to use!', editor);
//               // }}
//               onChange={(event, editor) => {
//                 const data = editor.getData();
//                 setNewContent(data);
//               }}
//               // onBlur={(event, editor) => {
//               //     console.log('Blur.', editor);webwebweb
//               // }}
//               // onFocus={(event, editor) => {
//               //     console.log('Focus.', editor); `
//               // }}
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               sx={{
//                 mt: 4,
//                 ml: 2,
//                 mb: 4,
//                 display: "block",
//                 backgroundColor: "orange",
//               }}
//               onClick={handleSubmit}
//             >
//               Update
//             </Button>
//           </Box>
//           {submittedQA && (
//             <Paper sx={{ mt: 4, p: 2 }}>
//               <Typography variant="h6">
//                 Submitted Question and Answer
//               </Typography>
//               <Typography variant="subtitle1">
//                 <strong>Question:</strong> {submittedQA.question}
//               </Typography>
//               <Typography variant="subtitle1">
//                 <strong>Answer:</strong> {submittedQA.answer}
//               </Typography>
//             </Paper>
//           )}
//         </Container>
//       </div>
//     </>
//   );
// };

// export default EditFAQ;


import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";

const EditFAQ = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newContent, setNewContent] = useState("");

  let params = useParams();
  let navigate = useNavigate();

  const handleQuestionChange = (e) => setQuestion(e.target.value);

  const handleSubmit = () => {
    setIsLoading(true);
    httpClient
      .patch(`admin/faq/edit-faq/${params.id}`, { question, answer: newContent })
      .then((res) => {
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
        setAnswer(res.data.data.answer);
        setQuestion(res.data.data.question);
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
            <TextField
              label="Question"
              value={question}
              onChange={handleQuestionChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                sx: {
                  marginTop: "6px",
                },
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
                setNewContent(data);
              }}
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
                width: "100%",
              }}
              onClick={handleSubmit}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </Box>

          {!isLoading && (
            <Paper sx={{ mt: 4, p: 2 }}>
              <Typography variant="h6">Preview of Submitted Data</Typography>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                <strong>Question:</strong> {question}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Answer:</strong> {newContent || answer}
              </Typography>
            </Paper>
          )}
        </Container>
      </div>
    </>
  );
};

export default EditFAQ;
