// import React, { useEffect, useState } from "react";
// import AppSidebar from "../../../components/AppSidebar";
// import AppHeader from "../../../components/AppHeader";
// import { CCol, CContainer } from "@coreui/react";
// import PageTitle from "../../common/PageTitle";
// import { DataGrid } from "@mui/x-data-grid";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { Button, IconButton, Snackbar } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import httpClient from "../../../util/HttpClient";
// import swal from "sweetalert2";
// import Loader from "../../../components/loader/Loader";
// import axios from "axios";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { useNavigate } from "react-router-dom";

// const Payments = () => {
//   const [alertMessage, setAlertMessage] = useState();
//   const [apiSuccess, setApiSuccess] = useState(false);
//   const [apiError, setApiError] = useState(false);
//   const [closeSnakeBar, setCloseSnakeBar] = useState(false);
//   const [userCount, setUserCount] = useState(0);
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [paginationModel, setPaginationModel] = useState({
//     page: 0,
//     pageSize: 10,
//   });

//   const [filterMode, setFilterMode] = useState("name");
//   const [status, setStatus] = useState("");
//   const [keyword, setKeyword] = useState("");
//   const navigate = useNavigate();

//   const handleSelect = (e) => {
//     httpClient
//       .patch(`/admin/users/${e.target.id}`, {
//         is_active: e.target.value === "active" ? true : false,
//       })
//       .then((res) => {
//         setStatus("ok");
//       });
//   };

//   const columns = [
//     { field: "col1", headerName: "#", width: 80 },
//     {
//       field: "col2",
//       headerName: "Image",
//       width: 200,
//       renderCell: (params) =>
//         params.value !== "N/A" ? (
//           <img
//             style={{
//               width: "70px",
//               objectFit: "cover",
//               cursor: "pointer",
//             }}
//             src={params.value}
//             alt="thumbnail"
//           />
//         ) : (
//           ""
//         ),
//     },
//     { field: "col3", headerName: "Max Ticket", width: 150 },
//     { field: "col4", headerName: "Ticket Price", width: 180 },
//     { field: "col5", headerName: "Total Amount Collect", width: 250 },
//     { field: "col6", headerName: "Total Ticket Buy", width: 180 },
//     // { field: "col7", headerName: "Updated At", width: 180 },
//     {
//       field: "col6",
//       headerName: "Action",
//       width: 200,
//       renderCell: (params) => (
//         <>
//           <VisibilityIcon
//             cursor="pointer"
//             style={{ color: "gold", marginRight: "20px" }}
//             onClick={() => navigate(`payment-singlecontest/${params.row.id}`)}
//             titleAccess="See"
//           />
//           {/* <DeleteIcon
//             cursor="pointer"
//             style={{ color: "red" }}
//             onClick={(e) => confirmBeforeDelete(e, params.row)}
//             titleAccess="Delete"
//           /> */}
//         </>
//       ),
//     },
//   ];

//   useEffect(() => {
//     setLoading(true);
//     httpClient
//       .get(`admin/contest/get-all-contest-details`)
//       .then((res) => {
//         console.log("contest Payments-->", res.data.data);
//         setUserCount(res.data.data.length);
//         setLoading(false);

//         setRows(
//           res.data.data.map((record, index) => ({
//             id: record?.contest._id,
//             col1: paginationModel.page * paginationModel.pageSize + (index + 1),
//             col2: record?.contest.contest_banner?.file_url || "N/A",
//             col3: record?.contest.maxTickets || "N/A",
//             col4: record?.contest.ticket_price || "N/A",
//             col5: record.totalAmountCollected || "N/A",
//             col6: record.totalTicketsBought || "N/A",
//           }))
//         );

//         setStatus("");
//       })
//       .catch((error) => {
//         setLoading(false);
//         console.error(error);
//       });
//   }, [paginationModel, alertMessage, status, keyword]);

//   // Handle get confirmation before delete
//   const confirmBeforeDelete = (e, params) => {
//     swal
//       .fire({
//         title: "Are you sure?",
//         text: "You will not be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, delete it!",
//       })
//       .then((result) => {
//         if (result.isConfirmed) {
//           deleteSingleUser(e, params);
//         }
//       });
//   };

//   const deleteSingleUser = (e, params) => {
//     const groupId = params.id;
//     httpClient
//       .delete(`delete-press/${groupId}`)
//       .then((res) => {
//         setAlertMessage(res.data.message);
//         setApiSuccess(true);
//         setApiError(false);
//         setLoading(false);
//         setCloseSnakeBar(true);
//         setStatus("deleted");
//       })
//       .catch((error) => {
//         setAlertMessage(error.response.data.message);
//         setApiError(true);
//         setApiSuccess(false);
//         setCloseSnakeBar(true);
//         setLoading(false);
//       });
//   };

//   // Handle records per page
//   const handleRecordPerPage = (e) => {
//     setLoading(true);
//     paginationModel.pageSize = e.target.value;
//     setPaginationModel({ ...paginationModel });
//   };

//   return (
//     <>
//       <AppSidebar />
//       <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
//         <AppHeader />
//         <PageTitle title="Payments" />

//         <CContainer>
//           <div className="d-flex justify-content-between align-items-center">
//             <h4>Contest Payments Details:</h4>
//           </div>

//           <div
//             style={{
//               // height: "600px",
//               minHeight: "600px",
//               border: "0px solid gray",
//               padding: 15,
//               borderRadius: 5,
//             }}
//           >
//             <Snackbar
//               open={closeSnakeBar}
//               autoHideDuration={1000}
//               message={alertMessage}
//               ContentProps={{
//                 sx: apiSuccess
//                   ? { backgroundColor: "green" }
//                   : { backgroundColor: "red" },
//               }}
//               anchorOrigin={{
//                 horizontal: "right",
//                 vertical: "bottom",
//               }}
//               action={
//                 <React.Fragment>
//                   <IconButton
//                     aria-label="close"
//                     color="inherit"
//                     sx={{ p: 0.5 }}
//                     onClick={() => setCloseSnakeBar(false)}
//                   >
//                     <CloseIcon />
//                   </IconButton>
//                 </React.Fragment>
//               }
//             />
//             <DataGrid
//               sx={{
//                 "& .MuiDataGrid-row:nth-of-type(2n)": {
//                   backgroundColor: "#d5dbd6",
//                 },
//                 "& .MuiDataGrid-columnHeader": {
//                   backgroundColor: "#d5dbd6",
//                 },
//                 "& .MuiDataGrid-cell": {
//                   outline: "none !important",
//                 },
//               }}
//               rows={rows}
//               columns={columns}
//               rowCount={userCount}
//               disableRowSelectionOnClick
//               pagination
//               paginationMode="server"
//               paginationModel={paginationModel}
//               disableColumnMenu
//               onPaginationModelChange={setPaginationModel}
//               loading={loading}
//               autoHeight
//             />
//           </div>
//         </CContainer>
//       </div>
//     </>
//   );
// };

// export default React.memo(Payments);

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CCol, CContainer } from "@coreui/react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, Snackbar } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import swal from "sweetalert2";
import httpClient from "../../../util/HttpClient";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import Loader from "../../../components/loader/Loader";

const Payments = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [closeSnackBar, setCloseSnackBar] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchContestPayments();
  }, [paginationModel, status]);

  const fetchContestPayments = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get(
        "admin/contest/get-all-contest-details?page=${paginationModel.page}&limit=${paginationModel.pageSize}"
      );
      const contestData = response.data.data;
      console.log("contestData", contestData);

      setUserCount(contestData.total);
      setRows(
        contestData.data.map((record, index) => ({
          id: record?.contest._id,
          col1: paginationModel.page * paginationModel.pageSize + (index + 1),
          col2: record?.contest.contest_banner?.file_url || "N/A",
          col3: record?.contest.maxTickets || "N/A",
          col4: record?.contest.ticket_price || "N/A",
          col5: record.totalAmountCollected
            ? record.totalAmountCollected.toFixed(2)
            : "N/A",
          col6: record.totalTicketsBought || "N/A",
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contest payments:", error);
      setLoading(false);
    }
  };

  const handleDelete = (params) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "You will not be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteSingleUser(params);
        }
      });
  };

  const deleteSingleUser = async (params) => {
    try {
      await httpClient.delete(`delete-press/${params.id}`);
      setAlertMessage("Deleted successfully");
      setApiSuccess(true);
      setCloseSnackBar(true);
      setStatus("deleted");
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Error deleting item");
      setApiSuccess(false);
      setCloseSnackBar(true);
    }
  };

  const columns = [
    { field: "col1", headerName: "#", width: 80 },
    {
      field: "col2",
      headerName: "Image",
      width: 200,
      renderCell: (params) =>
        params.value !== "N/A" ? (
          <img
            style={{ width: "70px", objectFit: "cover", cursor: "pointer" }}
            src={params.value}
            alt="thumbnail"
          />
        ) : (
          ""
        ),
    },
    { field: "col3", headerName: "Max Ticket", width: 150 },
    { field: "col4", headerName: "Ticket Price", width: 180 },
    { field: "col5", headerName: "Total Amount Collect", width: 250 },
    { field: "col6", headerName: "Total Ticket Buy", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <VisibilityIcon
            cursor="pointer"
            style={{ color: "gold", marginRight: "20px" }}
            onClick={() => navigate(`payment-singlecontest/${params.row.id}`)}
            titleAccess="See"
          />
        </>
      ),
    },
  ];

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Payments" />
        <CContainer>
          <h4>Payments Details:</h4>
          <Snackbar
            open={closeSnackBar}
            autoHideDuration={2000}
            message={alertMessage}
            onClose={() => setCloseSnackBar(false)}
            ContentProps={{
              sx: { backgroundColor: apiSuccess ? "green" : "red" },
            }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            action={
              <IconButton
                color="inherit"
                onClick={() => setCloseSnackBar(false)}
              >
                <CloseIcon />
              </IconButton>
            }
          />
          {loading ? (
            <Loader />
          ) : (
            <DataGrid
              sx={{
                "& .MuiDataGrid-row:nth-of-type(2n)": {
                  backgroundColor: "#d5dbd6",
                },
                "& .MuiDataGrid-columnHeader": { backgroundColor: "#d5dbd6" },
                "& .MuiDataGrid-cell": { outline: "none !important" },
              }}
              rows={rows}
              columns={columns}
              rowCount={userCount}
              disableRowSelectionOnClick
              pagination
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              autoHeight
            />
          )}
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(Payments);
