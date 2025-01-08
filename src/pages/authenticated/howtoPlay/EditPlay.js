// import React, { useEffect, useState } from "react";
// import { Box, Button, Container, TextField } from "@mui/material";
// import AppSidebar from "../../../components/AppSidebar";
// import AppHeader from "../../../components/AppHeader";
// import httpClient from "../../../util/HttpClient";
// import { useNavigate, useParams } from "react-router-dom";
// import Loader from "../../../components/loader/Loader";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// const EditPlay = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [thumbnail, setThumbnail] = useState(null);
//   const [howToPlayBanner, setHowToPlayBanner] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const navigate = useNavigate();
//   const params = useParams();

//   const handleTitleChange = (e) => setTitle(e.target.value);
//   const handleDescriptionChange = (e) => setDescription(e.target.value);
//   const handleThumbnailChange = (e) => setThumbnail(e.target.files[0]);
//   const handleHowToPlayBannerChange = (e) =>
//     setHowToPlayBanner(e.target.files[0]);

//   const handleSubmit = () => {
//     setIsLoading(true);
//     const formData = new FormData();

//     // Add title and description to the form data
//     formData.append("title", title);
//     formData.append("description", description);

//     // Append both files under the same key if they exist
//     if (thumbnail) {
//       formData.append("howToPlayBanner", thumbnail);
//     }
//     if (howToPlayBanner) {
//       formData.append("howToPlayBanner", howToPlayBanner);
//     }

//     updatePlayInDB(formData);
//   };

//   const updatePlayInDB = (formData) => {
//     httpClient
//       .patch(`admin/edit-how-to-play/${params.id}`, formData)
//       .then((res) => {
//         setIsLoading(false);
//         navigate(-1);
//       })
//       .catch((err) => {
//         setIsLoading(false);
//         console.error("Error updating data:", err);
//       });
//   };

//   useEffect(() => {
//     httpClient
//       .get(`admin/get-how-to-play-by-id/${params.id}`)
//       .then((res) => {
//         const result = res.data.data;
//         setIsLoading(false);
//         setTitle(result.title);
//         setDescription(result.description);
//         setThumbnail(result.thumbnail_url);
//         setHowToPlayBanner(result.video_url);
//       })
//       .catch((err) => {
//         console.error("Error fetching data:", err);
//         setIsLoading(false);
//       });
//   }, [params.id]);

//   return (
//     <>
//       <AppSidebar />
//       <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
//         <AppHeader />
//         <Button
//           variant="contained"
//           color="secondary"
//           sx={{ mt: 2, ml: 16 }}
//           onClick={() => navigate(-1)}
//         >
//           <ArrowBackIcon />
//           Back
//         </Button>
//         <Container maxWidth="sm" className="d-flex justify-content-center">
//           {isLoading ? (
//             <Loader />
//           ) : (
//             <Box
//               component="form"
//               noValidate
//               autoComplete="off"
//               sx={{ mt: 4, width: "80%" }}
//             >
//               <label>Title</label>
//               <TextField
//                 value={title}
//                 onChange={handleTitleChange}
//                 fullWidth
//                 margin="normal"
//                 placeholder="Party, Picnic, Birthday, Love, Romance..."
//               />
//               <label className="mt-4">Description</label>
//               <TextField
//                 value={description}
//                 onChange={handleDescriptionChange}
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={4}
//                 placeholder="Enter a description..."
//               />
//               <label className="mt-4">Thumbnail</label>
//               <TextField
//                 onChange={handleThumbnailChange}
//                 fullWidth
//                 margin="normal"
//                 variant="outlined"
//                 type="file"
//               />
//               <label className="mt-4">How to Play Banner (Video)</label>
//               <TextField
//                 onChange={handleHowToPlayBannerChange}
//                 fullWidth
//                 margin="normal"
//                 variant="outlined"
//                 type="file"
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{
//                   mt: 4,
//                   ml: 2,
//                   mb: 4,
//                   display: "block",
//                   backgroundColor: "orange",
//                 }}
//                 onClick={handleSubmit}
//                 disabled={isLoading}
//               >
//                 Update
//               </Button>
//             </Box>
//           )}
//         </Container>
//       </div>
//     </>
//   );
// };

// export default EditPlay;
// import React, { useEffect, useState } from "react";
// import { Box, Button, Container, TextField } from "@mui/material";
// import AppSidebar from "../../../components/AppSidebar";
// import AppHeader from "../../../components/AppHeader";
// import httpClient from "../../../util/HttpClient";
// import { useNavigate, useParams } from "react-router-dom";
// import Loader from "../../../components/loader/Loader";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// const EditPlay = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [thumbnail_url, setThumbnail_url] = useState(null);
//   const [thumbnail_url_app, setThumbnail_url_app] = useState(null);
//   const [video_url, setVideo_url] = useState(null);
//   const [video_url_app, setVideo_url_app] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [platform, setPlatform] = useState("Web");

//   const navigate = useNavigate();
//   const params = useParams();

//   const handleTitleChange = (e) => setTitle(e.target.value);
//   const handleDescriptionChange = (e) => setDescription(e.target.value);
//   const handleThumbnail_url = (e) => setThumbnail_url(e.target.files[0]);
//   const handleThumbnail_url_app = (e) =>
//     setThumbnail_url_app(e.target.files[0]);
//   const handleVideo_url = (e) => setVideo_url(e.target.files[0]);
//   const handleVideo_url_app = (e) => setVideo_url_app(e.target.files[0]);

//   const handleSubmit = () => {
//     setIsLoading(true);
//     const formData = new FormData();

//     // Add title and description to the form data
//     formData.append("title", title);
//     formData.append("description", description);

//     // Append both files under the same key if they exist
//     if (platform === "Web") {
//       formData.append("thumbnail_url", thumbnail_url);
//       formData.append("video_url", video_url);
//     }
//     if (platform === "App") {
//       formData.append("thumbnail_url_app", thumbnail_url_app);
//       formData.append("video_url_app", video_url_app);
//     }

//     updatePlayInDB(formData);
//   };

//   const updatePlayInDB = (formData) => {
//     httpClient
//       .patch(`admin/edit-how-to-play/${params.id}`, formData)
//       .then((res) => {
//         setIsLoading(false);
//         navigate(-1);
//       })
//       .catch((err) => {
//         setIsLoading(false);
//         console.error("Error updating data:", err);
//       });
//   };

//   useEffect(() => {
//     httpClient
//       .get(`admin/get-how-to-play-by-id/${params.id}`)
//       .then((res) => {
//         const result = res.data.data;
//         console.log(" res.data.data;", res.data.data);
//         setIsLoading(false);
//         setTitle(result.title);
//         setDescription(result.description);
//         setThumbnail_url(result.thumbnail_url);
//         setThumbnail_url_app(result.thumbnail_url_app);
//         setVideo_url(result.video_url);
//         setVideo_url_app(result.video_url_app);
//       })
//       .catch((err) => {
//         console.error("Error fetching data:", err);
//         setIsLoading(false);
//       });
//   }, [params.id]);

//   return (
//     <>
//       <AppSidebar />
//       <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
//         <AppHeader />
//         <Button
//           variant="contained"
//           color="secondary"
//           sx={{ mt: 2, ml: 16 }}
//           onClick={() => navigate(-1)}
//         >
//           <ArrowBackIcon />
//           Back
//         </Button>
//         <Container maxWidth="sm" className="d-flex justify-content-center">
//           {isLoading ? (
//             <Loader />
//           ) : (
//             <Box
//               component="form"
//               noValidate
//               autoComplete="off"
//               sx={{ mt: 4, width: "80%" }}
//             >
//               <label htmlFor="title">Title</label>
//               <TextField
//                 id="title"
//                 value={title}
//                 onChange={handleTitleChange}
//                 fullWidth
//                 margin="normal"
//                 placeholder="Enter title"
//               />
//               <label htmlFor="description" className="mt-4">
//                 Description
//               </label>
//               <TextField
//                 id="description"
//                 value={description}
//                 onChange={handleDescriptionChange}
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={4}
//                 placeholder="Enter a description"
//               />

//               <div className="d-flex justify-content-between mt-4">
//                 <Button
//                   variant="contained"
//                   color={
//                     platform
//                       ? platform === "Web"
//                         ? "primary"
//                         : "secondary"
//                       : "default"
//                   }
//                   onClick={() => setPlatform("Web")}
//                 >
//                   Web
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color={
//                     platform
//                       ? platform === "App"
//                         ? "primary"
//                         : "secondary"
//                       : "default"
//                   }
//                   onClick={() => setPlatform("App")}
//                 >
//                   App
//                 </Button>
//               </div>

//               {platform === "Web" && (
//                 <>
//                   <label className="mt-4">Thumbnail URL</label>
//                   <TextField
//                     onChange={handleThumbnail_url}
//                     fullWidth
//                     margin="normal"
//                     variant="outlined"
//                     type="file"
//                   />
//                   <label className="mt-4">Video URL</label>
//                   <TextField
//                     onChange={handleVideo_url}
//                     fullWidth
//                     margin="normal"
//                     variant="outlined"
//                     type="file"
//                   />
//                 </>
//               )}

//               {platform === "App" && (
//                 <>
//                   <label className="mt-4">Thumbnail URL (App)</label>
//                   <TextField
//                     onChange={handleThumbnail_url_app}
//                     fullWidth
//                     margin="normal"
//                     variant="outlined"
//                     type="file"
//                   />
//                   <label className="mt-4">Video URL (App)</label>
//                   <TextField
//                     onChange={handleVideo_url_app}
//                     fullWidth
//                     margin="normal"
//                     variant="outlined"
//                     type="file"
//                   />
//                 </>
//               )}

//               <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{
//                   mt: 4,
//                   ml: 2,
//                   mb: 4,
//                   display: "block",
//                   backgroundColor: "orange",
//                 }}
//                 onClick={handleSubmit}
//                 disabled={isLoading}
//               >
//                 Update
//               </Button>
//             </Box>
//           )}
//         </Container>
//       </div>
//     </>
//   );
// };

// export default EditPlay;

import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/loader/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditPlay = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail_url, setThumbnail_url] = useState(null);
  const [thumbnail_url_app, setThumbnail_url_app] = useState(null);
  const [video_url, setVideo_url] = useState(null);
  const [video_url_app, setVideo_url_app] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [platform, setPlatform] = useState("Web");

  const navigate = useNavigate();
  const params = useParams();

  // Handlers for form input changes
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleThumbnail_url = (e) => setThumbnail_url(e.target.files[0]);
  const handleThumbnail_url_app = (e) =>
    setThumbnail_url_app(e.target.files[0]);
  const handleVideo_url = (e) => setVideo_url(e.target.files[0]);
  const handleVideo_url_app = (e) => setVideo_url_app(e.target.files[0]);

  // Handle form submission
  const handleSubmit = () => {
    setIsLoading(true);
    const formData = new FormData();

    // Add title and description to the form data
    formData.append("title", title);
    formData.append("description", description);

    // Append files based on the selected platform
    if (platform === "Web") {
      formData.append("thumbnail_url", thumbnail_url);
      formData.append("video_url", video_url);
    } else if (platform === "App") {
      formData.append("thumbnail_url_app", thumbnail_url_app);
      formData.append("video_url_app", video_url_app);
    }

    updatePlayInDB(formData);
  };

  // Function to update play data in the database
  const updatePlayInDB = (formData) => {
    httpClient
      .patch(`admin/edit-how-to-play/${params.id}`, formData)
      .then((res) => {
        setIsLoading(false);
        navigate(-1); // Navigate back after successful update
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Error updating data:", err);
      });
  };

  // Fetch existing play data based on the provided ID
  useEffect(() => {
    httpClient
      .get(`admin/get-how-to-play-by-id/${params.id}`)
      .then((res) => {
        const result = res.data.data;
        setIsLoading(false);
        setTitle(result.title);
        setDescription(result.description);
        setThumbnail_url(result.thumbnail_url);
        setThumbnail_url_app(result.thumbnail_url_app);
        setVideo_url(result.video_url);
        setVideo_url_app(result.video_url_app);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setIsLoading(false);
      });
  }, [params.id]);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2, ml: 16 }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
          Back
        </Button>
        <Container maxWidth="sm" className="d-flex justify-content-center">
          {isLoading ? (
            <Loader />
          ) : (
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ mt: 4, width: "80%" }}
            >
              <label htmlFor="title">Title</label>
              <TextField
                id="title"
                value={title}
                onChange={handleTitleChange}
                fullWidth
                margin="normal"
                placeholder="Enter title"
              />
              <label htmlFor="description" className="mt-4">
                Description
              </label>
              <TextField
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                placeholder="Enter a description"
              />

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="contained"
                  color={platform === "Web" ? "primary" : "secondary"}
                  onClick={() => setPlatform("Web")}
                >
                  Web
                </Button>
                <Button
                  variant="contained"
                  color={platform === "App" ? "primary" : "secondary"}
                  onClick={() => setPlatform("App")}
                >
                  App
                </Button>
              </div>

              {platform === "Web" && (
                <>
                  <label className="mt-4">Thumbnail URL</label>
                  <TextField
                    onChange={handleThumbnail_url}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="file"
                  />
                  <label className="mt-4">Video URL</label>
                  <TextField
                    onChange={handleVideo_url}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="file"
                  />
                </>
              )}

              {platform === "App" && (
                <>
                  <label className="mt-4">Thumbnail URL (App)</label>
                  <TextField
                    onChange={handleThumbnail_url_app}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="file"
                  />
                  <label className="mt-4">Video URL (App)</label>
                  <TextField
                    onChange={handleVideo_url_app}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    type="file"
                  />
                </>
              )}

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
                disabled={isLoading}
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

export default EditPlay;
