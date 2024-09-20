
import React, { useEffect, useState, useCallback } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Snackbar, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import { Visibility } from "@mui/icons-material";
import { GridOverlay } from '@mui/x-data-grid';
import { Typography } from '@mui/material';


const Subscription = () => {

  const CustomNoRowsOverlay = () => {
    return (
      <GridOverlay>
        <Typography variant="h6" color="textSecondary">
          No data found
        </Typography>
      </GridOverlay>
    );
  };
  const [alertMessage, setAlertMessage] = useState("");
  const [apiStatus, setApiStatus] = useState({ success: false, error: false });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  const [update, setUpdate] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelect = useCallback((e) => {
    httpClient
      .patch(`/admin/users/${e.target.id}`, {
        is_active: e.target.value === "active",
      })
      .then((res) => {
        console.log("update status ==> ", res);
      });
  }, []);

  const columns = [
    { field: "col1", headerName: "#", width: 100 },
    { field: "col2", headerName: "User Name", width: 250 },
    { field: "col3", headerName: "Phone Number", width: 200 },
    { field: "col4", headerName: "In-app_plan_name", width: 150 },
    { field: "col5", headerName: "Plan Type", width: 100 },
    { field: "col6", headerName: "Start_plan_date", width: 150 },
    { field: "col7", headerName: "Expiry_plan_date", width: 200 },

   
  ];

  const handleView = (row) => {
    setSelectedUser(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const confirmBeforeDelete = useCallback((params) => {
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
          deleteSingleUser(params.id);
        }
      });
  }, []);

  const deleteSingleUser = useCallback((userId) => {
    httpClient
      .delete(`/admin/subscriptions/${userId}`)
      .then((res) => {
        setAlertMessage(res.data.message);
        setApiStatus({ success: true, error: false });
        setSnackbarOpen(true);
        setLoading(false);
        setUpdate(1);
      })
      .catch((error) => {
        setAlertMessage(error.response.data.message);
        setApiStatus({ success: false, error: true });
        setSnackbarOpen(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);

    httpClient
      .get(`/admin/users-subscription?pageSize=${paginationModel.pageSize}&pageNumber=${paginationModel.page}`)
      .then((res) => {
        console.log("resssss", res.data?.result?.subscriptionCount)
        setUserCount(res.data?.result?.subscriptionCount);
        setLoading(false);

        setRows(
          res.data?.result?.getUserSubscription?.map((doc, index) => ({
            id: doc._id,
            col1: paginationModel.page * paginationModel.pageSize + (index + 1),
            col2: doc?.user_id?.username|| "N/A",
            col3: doc.user_id?.phone || "N/A",
            col4: doc.inapp_plan_name.substring(4) || "N/A",
            col5: doc.planeType || "N/A",
            col6: doc.start_plan_date.substring(0, 10) || "N/A",
            col7: doc.expiry_plan_date.substring(0, 10) || "N/A",
            // col8: doc.created_at.substring(0, 10),
          }))
        );
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, [update, paginationModel]);

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
        <PageTitle title="Users subscription" />

        <CContainer>
          <h4 className="">Subscription List :</h4>
          <div
            style={{
              height: "auto",
              minHeight: "600px",
              border: "1px solid gray",
              padding: 15,
              borderRadius: 5,
              backgroundColor: "#f8f9fa",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={1000}
              message={alertMessage}
              ContentProps={{
                sx: apiStatus.success
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "red" },
              }}
              anchorOrigin={{
                horizontal: "right",
                vertical: "bottom",
              }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  sx={{ p: 0.5 }}
                  onClick={() => setSnackbarOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              }
            />
            <div
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                marginBottom: "10px",
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
                  outline: "none !important",
                },
                "& .MuiDataGrid-cell": {
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
              components={{
                NoRowsOverlay: CustomNoRowsOverlay,
              }}
            />

          </div>
        </CContainer>
      </div>

      {selectedUser && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Reported User"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedUser.col2}
              readOnly
              InputLabelProps={{
                sx: {
                  // fontSize: "18px", // Example: Set custom font size
                  marginTop: "5px"
                },
              }}
            />
            <TextField
              margin="dense"
              label="Reported By"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedUser.col6}
              readOnly
              InputLabelProps={{
                sx: {
                  // fontSize: "18px", // Example: Set custom font size
                  marginTop: "5px"
                },
              }}
            />
            <TextField
              margin="dense"
              label="Reason"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={selectedUser.col4}
              readOnly
              InputLabelProps={{
                sx: {
                  // fontSize: "18px", // Example: Set custom font size
                  marginTop: "5px"
                },
              }}
            />
            {/* <TextField 
              margin="dense"
              label="Reported At"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedUser.col7}
              readOnly
              InputLabelProps={{
                sx: {
                  // fontSize: "18px", // Example: Set custom font size
                  marginTop:"5px"
                },
              }}
            /> */}
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



export default Subscription;
