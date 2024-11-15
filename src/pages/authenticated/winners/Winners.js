import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import Loader from "../../../components/loader/Loader";
import axios from "axios";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Winners = () => {
  const [alertMessage, setAlertMessage] = useState();
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [filterMode, setFilterMode] = useState("name");
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const navigate = useNavigate();

  const handleSelect = (e) => {
    httpClient
      .patch(`/admin/users/${e.target.id}`, {
        is_active: e.target.value === "active" ? true : false,
      })
      .then((res) => {
        console.log("update status ==> ", res);
        setStatus("ok");
      });
  };

  const columns = [
    { field: "col1", headerName: "#", width: 100 },
    {
      field: "col2",
      headerName: "Name",
      width: 150,
    },
    {
      field: "col3",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "col4",
      headerName: "Contest Id",
      width: 180,
    },
    {
      field: "col5",
      headerName: "Price",
      width: 150,
    },
    {
      field: "col6",
      headerName: "Created At",
      width: 250,
    },
    {
      field: "col7",
      headerName: "Closest Coordinate",
      width: 250,
      renderCell: (params) => {
        console.log(params); // Log the entire params object to see what it contains
        const coordinates = params.row.closestCoordinate;
        if (coordinates && coordinates.x !== null && coordinates.y !== null) {
          return (
            <span>
              X: {coordinates.x}, Y: {coordinates.y}
            </span>
          );
        }
        return <span>N/A</span>;
      },
    },
    {
      field: "col8",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Visibility
              cursor={"pointer"}
              style={{ color: "green" }}
              onClick={() => handleView(params.row)}
            />
            <DeleteIcon
              className="ms-3"
              cursor={"pointer"}
              style={{ color: "red" }}
              onClick={(e) => confirmBeforeDelete(e, params.row)}
            />
          </>
        );
      },
    },
  ];

  const handleView = (row) => {
    setSelectedFeedback(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFeedback(null);
  };

  //handle get confirmation before delete user
  const confirmBeforeDelete = (e, params) => {
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
          deleteSingleUser(e, params);
        }
      });
  };

  const deleteSingleUser = (e, params) => {
    const userId = params.id;
    httpClient
      .delete(`/admin/Winners/${userId}`)
      .then((res) => {
        setAlertMessage(res.data.message);
        setApiSuccess(true);
        setApiError(false);
        setLoading(false);
        setCloseSnakeBar(true);
        setStatus("deleted");
      })
      .catch((error) => {
        setAlertMessage(error.response.data.message);
        setApiError(true);
        setApiSuccess(false);
        setCloseSnakeBar(true);
        setLoading(false);
      });
  };

  //fetching user information
  useEffect(() => {
    setLoading(true);
    httpClient
      .get(`api/v1/admin/contest/the-winners-circle/?year=2024`)
      .then((res) => {
        const { data } = res.data; // destructure response data
        setUserCount(data.count);
        setLoading(false);
        console.log("winners ==> ", data);

        // Check if data.docs exists and is an array before calling map
        if (Array.isArray(data)) {
          setRows(
            data.map((doc, index) => {
              return {
                id: doc._id,
                col1:
                  paginationModel.page * paginationModel.pageSize + (index + 1),
                col2: doc?.userId?.email || "N/A", // Email column
                col3: doc?.userId?.phone || "N/A", // Phone column
                col4: doc?.contestId?._id || doc?.contestId?._id || "N/A", // Contest ID (adjust property name as needed)
                col5: doc?.contestPaymentsId?.amount || "N/A", // Assuming price is in contestPaymentsId (adjust if needed)
                col6: doc.createdAt ? doc.createdAt.substring(0, 10) : "N/A", // Created At column
                col7: doc?.closestCoordinate || "N/A",
                //  doc?.closestCoordinate ? (
                //   <span>
                //     X: {doc.closestCoordinate.x || "N/A"}, Y:{" "}
                //     {doc.closestCoordinate.y || "N/A"}
                //   </span>
                // ) : (
                //   <span>N/A</span>
                // ), // Closest Coordinate column
              };
            })
          );
        } else {
          // Handle case where data.docs is not an array (e.g., show a message or set an empty state)
          setRows([]); // Optionally, set rows to empty if docs is not an array
        }
        setStatus(""); // Reset status if needed
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        setRows([]); // Optionally, set rows to empty in case of an error
      });
  }, [paginationModel, status]);

  const handleRecordPerPage = (e) => {
    setLoading(true);
    paginationModel.pageSize = e.target.value;
    setPaginationModel({ ...paginationModel });
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Winners" />

        <CContainer>
          <h4 className="">Winners :</h4>
          <div
            style={{
              height: "600px",
              minHeight: "600px",
              border: "1px solid gray",
              padding: 15,
              borderRadius: 5,
            }}
          >
            <Snackbar
              open={closeSnakeBar}
              autoHideDuration={1000}
              message={alertMessage}
              ContentProps={{
                sx: apiSuccess
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "red" },
              }}
              anchorOrigin={{
                horizontal: "right",
                vertical: "bottom",
              }}
              action={
                <React.Fragment>
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    sx={{ p: 0.5 }}
                    onClick={() => setCloseSnakeBar(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </React.Fragment>
              }
            />
            <div
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
              }}
            >
              <CCol xs={5}>
                Show
                <input
                  className="mx-2"
                  type="number"
                  id="number"
                  name="number"
                  placeholder="10"
                  defaultValue={"10"}
                  outline="none"
                  title="Enter a Number"
                  cursor="pointer"
                  min={0}
                  style={{
                    width: "45px",
                    outline: "none",
                    borderRadius: 5,
                    border: "1px solid gray",
                    fontSize: "1rem",
                    fontWeight: 600,
                    textAlign: "center",
                    height: 25,
                  }}
                  onChange={handleRecordPerPage}
                />
                Records per page
              </CCol>
            </div>
            <DataGrid
              sx={{
                "& .MuiDataGrid-row:nth-of-type(2n)": {
                  backgroundColor: "#d5dbd6",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#d5dbd6",
                },
                "& .MuiDataGrid-cell": {
                  outline: "none !important",
                },
                "& .MuiDataGrid-row": {
                  outline: "none !important",
                },
              }}
              rows={rows}
              columns={columns}
              rowCount={userCount}
              disableRowSelectionOnClick
              paginationMode="server"
              paginationModel={paginationModel}
              disableColumnMenu
              onPaginationModelChange={setPaginationModel}
              loading={loading}
              autoHeight
            />
          </div>
        </CContainer>
      </div>

      {selectedFeedback && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Details</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Email :"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedFeedback.col2}
              readOnly
              InputLabelProps={{
                sx: {
                  // fontSize: "18px", // Example: Set custom font size
                  marginTop: "5px",
                },
              }}
            />
            <TextField
              margin="dense"
              label="Phone Number :"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedFeedback.col3}
              readOnly
              InputLabelProps={{
                sx: {
                  // fontSize: "18px", // Example: Set custom font size
                  marginTop: "5px",
                },
              }}
            />
            <TextField
              margin="dense"
              label="Price :"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={selectedFeedback.col5}
              readOnly
              InputLabelProps={{
                sx: {
                  // fontSize: "18px", // Example: Set custom font size
                  marginTop: "5px",
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default React.memo(Winners);
