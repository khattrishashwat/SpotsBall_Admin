import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  IconButton,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import Loader from "../../../components/loader/Loader";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

const GetPayment = () => {
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
  const [coordinatesDialogOpen, setCoordinatesDialogOpen] = useState(false);
  const [coordinatesData, setCoordinatesData] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

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
    { field: "col1", headerName: "#", width: 80 },
    { field: "col2", headerName: "User Name", width: 150 },
    { field: "col3", headerName: "Tickets", width: 150 },
    { field: "col4", headerName: "Tickets Price", width: 150 },
    { field: "col5", headerName: "Discount Amount", width: 150 },
    { field: "col6", headerName: "GST Amount", width: 150 },
    { field: "col7", headerName: "Sub Total Amount", width: 150 },
    { field: "col8", headerName: "Platform Fee Amount", width: 150 },
    { field: "col9", headerName: "GST Platform Fee Amount", width: 150 },
    { field: "col10", headerName: "Total Platform Amount", width: 150 },
    { field: "col11", headerName: "Amount", width: 180 },
    { field: "col12", headerName: "Promo Codes", width: 180 },
    { field: "col13", headerName: "Payment ID", width: 180 },
    {
      field: "col14",
      headerName: "No. Coordinates Chosen",
      width: 170,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {params.value.length} {/* Display the number */}
          <IconButton
            onClick={() => handleViewCoordinates(params.row.col14)}
            size="small"
            sx={{ marginLeft: 1 }}
          >
            <VisibilityIcon color="primary" />
          </IconButton>
        </div>
      ),
    },
    { field: "col15", headerName: "Transaction Status", width: 130 },
    { field: "col16", headerName: "Created At", width: 180 },
  ];

  useEffect(() => {
    setLoading(true);
    httpClient
      .get(
        `admin/contest-payments/${params.id}?page=${paginationModel.page}&limit=${paginationModel.pageSize}`
      )
      .then((res) => {
        const data = res.data.data;

        setUserCount(data.length);
        setLoading(false);

        setRows(
          data.map((record, index) => ({
            id: record._id,
            col1: paginationModel.page * paginationModel.pageSize + (index + 1), // Row number
            col2: record.userId?.first_name
              ? `${record.userId.first_name} ${record.userId.last_name}`
              : "N/A", // User Name
            col3: record.tickets || "N/A", // Tickets
            col4: record.ticketAmount || "N/A", // Tickets
            col5: record.discountAmount
              ? `${record.discountAmount.toFixed(2)}`
              : "N/A", // Discount Amount
            col6: record.gstAmount ? `${record.gstAmount.toFixed(2)}` : "N/A", // GST Amount
            col7: record.subTotalAmount
              ? `${record.subTotalAmount.toFixed(2)}`
              : "N/A", // Sub Total Amount
            col8: record.platformFeeAmount
              ? `${record.platformFeeAmount.toFixed(2)}`
              : "N/A", // Platform Fee Amount
            col9: record.gstOnPlatformFeeAmount
              ? `${record.gstOnPlatformFeeAmount.toFixed(2)}`
              : "N/A", // GST Platform Fee Amount
            col10: record.totalRazorPayFeeAmount
              ? `${record.totalRazorPayFeeAmount.toFixed(2)}`
              : "N/A", // Total Razor Pay Amount
            col11: record.amount ? `${record.amount.toFixed(2)}` : "N/A", // Amount
            col12: record.discountApplied?.name
              ? `${record.discountApplied.name} (${record.discountApplied.discountPercentage}%)`
              : "N/A",
            col13: record.paymentId || "N/A", // Payment ID
            col14: record.coordinates || 0, // Number of Coordinates Chosen
            col15: record.transaction_status || "N/A",
            col16: record.createdAt
              ? new Date(record.createdAt).toLocaleDateString()
              : "N/A", // Created At
          }))
        );
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching contest payments:", error);
      });
  }, [paginationModel, params.id]);

  const handleViewCoordinates = (row) => {
    console.log("roef", row);

    setCoordinatesData(row || []);
    setCoordinatesDialogOpen(true);
  };

  const handleCloseCoordinatesDialog = () => {
    setCoordinatesDialogOpen(false);
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="GetPayment" />
        <CContainer>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="">User Payments Details : </h4>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, ml: 16 }}
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowBackIcon />
              Back
            </Button>
          </div>
          <div
            style={{
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
              pagination
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

      {/* Coordinates Dialog */}
      <Dialog
        open={coordinatesDialogOpen}
        onClose={handleCloseCoordinatesDialog}
      >
        <DialogTitle>Coordinates</DialogTitle>
        <DialogContent>
          {coordinatesData.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    #
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    X Coordinate
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Y Coordinate
                  </th>
                </tr>
              </thead>
              <tbody>
                {coordinatesData.map((coord, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {index + 1}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {coord.x}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {coord.y}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No coordinates available.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCoordinatesDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(GetPayment);
