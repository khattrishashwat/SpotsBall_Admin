// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Container,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
// } from "@mui/material";
// import AppSidebar from "../../../components/AppSidebar";
// import AppHeader from "../../../components/AppHeader";
// import httpClient from "../../../util/HttpClient";

// const Profile = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [profileData, setProfileData] = useState({ name: "", email: "" });

//   useEffect(() => {
//     httpClient
//       .get("admin/get-profile")
//       .then((res) => {
//         const { name, email } = res.data.data; // Extract name and email from the response
//         setProfileData({ name, email });
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         setIsLoading(false);
//         console.error("Error fetching profile:", err);
//       });
//   }, []);

//   return (
//     <>
//       <AppSidebar />
//       <div
//         className="wrapper bg-light min-vh-100 d-flex-column align-items-center"
//         style={{ backgroundColor: "red" }}
//       >
//         <AppHeader />
//         <Container maxWidth="sm">
//           {isLoading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <Box sx={{ mt: 4 }}>
//               <Typography variant="h4" gutterBottom>
//                 Profile
//               </Typography>
//               <TableContainer component={Paper} sx={{ mt: 3 }}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell
//                         align="left"
//                         sx={{ fontWeight: "bold", fontSize: "16px" }}
//                       >
//                         Field
//                       </TableCell>
//                       <TableCell
//                         align="left"
//                         sx={{ fontWeight: "bold", fontSize: "16px" }}
//                       >
//                         Details
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell align="left">Name</TableCell>
//                       <TableCell align="left">{profileData.name}</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell align="left">Email</TableCell>
//                       <TableCell align="left">{profileData.email}</TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Box>
//           )}
//         </Container>
//       </div>
//     </>
//   );
// };

// export default Profile;


import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import PageTitle from "../../common/PageTitle";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import httpClient from "../../../util/HttpClient";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    httpClient
      .get("admin/get-profile")
      .then((res) => {
        const { name, email } = res.data.data; // Extract name and email from the response
        setProfileData({ name, email });
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Error fetching profile:", err);
      });
  }, []);

  const handleEditClick = () => {
    setEditedName(profileData.name);
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Save the updated name
    httpClient
      .post("admin/update-profile", { name: editedName })
      .then(() => {
        setProfileData((prev) => ({ ...prev, name: editedName }));
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error updating name:", err);
      });
  };

  return (
    <>
      <AppSidebar />
      <div
        className="wrapper bg-light min-vh-100 d-flex-column align-items-center"
        style={{ backgroundColor: "red" }}
      >
        <AppHeader />
        <PageTitle title="Profile" />

        <Container maxWidth="sm">
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" gutterBottom>
                Profile
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="left"
                        sx={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Field
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Details
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="left">
                        {isEditing ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <TextField
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              size="small"
                              variant="outlined"
                              sx={{ marginRight: 1 }}
                            />
                            <IconButton
                              color="primary"
                              onClick={handleSaveClick}
                            >
                              <CheckIcon />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ marginRight: 1 }}>
                              {profileData.name}
                            </Typography>
                            <IconButton
                              color="primary"
                              onClick={handleEditClick}
                            >
                              <EditIcon />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">Email</TableCell>
                      <TableCell align="left">{profileData.email}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Container>
      </div>
    </>
  );
};

export default Profile;
