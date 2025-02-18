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

const AllPayments = () => {
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
    fetchContestAllPayment();
  }, []);

  const fetchContestAllPayment = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get(
        `admin/contest-payments/get-all-contest-payments?page=${paginationModel.page}&limit=${paginationModel.pageSize}`
      );
      const contestData = response.data.data;
      console.log("contestData payment", contestData);

      setUserCount(contestData.total);
      setRows(
        contestData.data.map((record, index) => ({
          id: record._id,
          col1:
            (paginationModel.page) * paginationModel.pageSize + (index + 1), // Updated this line
          col2: record.userId || "N/A",
          col3: record.contestId || "N/A",
          col4: record.discountApplied?.name
            ? `${record.discountApplied.name} (${record.discountApplied.discountPercentage}%)`
            : "N/A",
          col5: record.promocodeApplied?.name
            ? `${record.promocodeApplied.name} (${record.promocodeApplied.amount}%)`
            : "N/A",
          col6: record.tickets || "N/A",
          col7: record.ticketAmount || "N/A",
          col8: record.amount ? record.amount.toFixed(2) : "N/A",
          col9: record.paymentId || "N/A",
          col10: record.transaction_status || "N/A",
          col11: record.pdf || "N/A",
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contest AllPayment:", error);
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
    { field: "col2", headerName: "User", width: 200 },
    { field: "col3", headerName: "Contest", width: 200 },
    { field: "col4", headerName: "Discount Amount", width: 150 },
    { field: "col5", headerName: "Promo Codes", width: 180 },
    { field: "col6", headerName: "Tickets", width: 150 },
    { field: "col7", headerName: "Ticket Amount", width: 150 },
    { field: "col8", headerName: "Amount (All Tax Included)", width: 180 },
    { field: "col9", headerName: "Payment ID", width: 180 },
    { field: "col10", headerName: "Transaction Status", width: 250 },
    {
      field: "col11",
      headerName: "PDF",
      width: 180,
      renderCell: (params) =>
        params.value !== "N/A" ? (
          <button
            onClick={() => window.open(params.value, "_blank")}
            style={{
              padding: "5px 10px",
              color: "white",
              backgroundColor: "blue",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Open PDF
          </button>
        ) : (
          "N/A"
        ),
    },
  ];

  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const getPaginatedData = () => {
    const startIndex = paginationModel.page * paginationModel.pageSize;
    const endIndex = startIndex + paginationModel.pageSize;
    return rows.slice(startIndex, endIndex);
  };

  const handleRecordPerPage = (e) => {
    const newPageSize = e.target.value;
    setPaginationModel((prevState) => ({
      ...prevState,
      pageSize: newPageSize,
    }));
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="All Payment" />
        <CContainer>
          <h4>All Payments:</h4>
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
              rows={rows}
              columns={columns}
              rowCount={userCount}
              pageSize={paginationModel.pageSize}
              page={paginationModel.page} // Fixing page indexing
              pagination
              paginationMode="server"
              onPaginationModelChange={handlePaginationChange}
              autoHeight
            />
          )}
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(AllPayments);
