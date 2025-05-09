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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  useEffect(() => {
    fetchContestAllPayment();
  }, [paginationModel]);

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
          col1: paginationModel.page * paginationModel.pageSize + (index + 1), // Updated this line
          col2: record.userId?.first_name
            ? `${record.userId.first_name} ${record.userId.last_name}`
            : "N/A",

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
          col10: record.createdAt
            ? new Date(record.createdAt).toISOString().substring(0, 10)
            : "N/A",
          col11: record.transaction_status || "N/A",
          col12: record.pdf || "N/A",
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
    { field: "col2", headerName: t("User"), width: 200 },
    { field: "col3", headerName: t("Contest"), width: 200 },
    { field: "col4", headerName: t("Discount Amount"), width: 150 },
    { field: "col5", headerName: t("Promo Codes"), width: 180 },
    { field: "col6", headerName: t("Tickets"), width: 150 },
    { field: "col7", headerName: t("Ticket Amount"), width: 150 },
    { field: "col8", headerName: t("Amount (All Tax Included)"), width: 180 },
    { field: "col9", headerName: t("Payment ID"), width: 180 },
    { field: "col10", headerName: t("Payment Date"), width: 120 },
    { field: "col11", headerName: t("Transaction Status"), width: 140 },
    {
      field: "col12",
      headerName: t("PDF"),
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
      <div className="wraper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="All Payment" />
        <CContainer>
          <h4>{t("All Payments")}:</h4>
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
              pageSizeOptions={[10, 20, 50]}
              paginationModel={paginationModel}
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
