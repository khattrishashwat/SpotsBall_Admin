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
  const { t } = useTranslation();

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
      headerName: t("Image"),
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
    { field: "col3", headerName: t("Max Ticket"), width: 150 },
    { field: "col4", headerName: t("Ticket Price"), width: 180 },
    { field: "col5", headerName: t("Total Amount Collect"), width: 250 },
    { field: "col6", headerName: t("Total Ticket Buy"), width: 180 },
    {
      field: "action",
      headerName: t("Action"),
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
          <h4>{t("Contest Payments Details")}:</h4>
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
