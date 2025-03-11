import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CContainer } from "@coreui/react";
import { DataGrid } from "@mui/x-data-grid";
import { MenuItem, Select, Snackbar, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import swal from "sweetalert2";
import { useTranslation } from "react-i18next";

import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import httpClient from "../../../util/HttpClient";
import Loader from "../../../components/loader/Loader";

const Subscribers = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnackBar, setCloseSnackBar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [status, setStatus] = useState("");
  const [allData, setAllData] = useState([]);
    const { t } = useTranslation();

  const navigate = useNavigate();

  const handleSelect = (e) => {
    httpClient
      .patch(`/admin/users/${e.target.id}`, {
        is_active: e.target.value === "active",
      })
      .then(() => setStatus("ok"))
      .catch((error) => console.error("Status update failed", error));
  };

  const columns = [
    { field: "col1", headerName: "#", width: 200 },
    { field: "col2", headerName: t("Email/Phone"), width: 350 },
    { field: "col3", headerName: t("Updated At"), width: 200 },
    { field: "col4", headerName: t("Created At"), width: 200 },
    {
      field: "col5",
      headerName: t("Action"),
      width: 150,
      renderCell: (params) => (
        <IconButton
          onClick={() => confirmBeforeDelete(params.row)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const confirmBeforeDelete = (params) => {
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

  const deleteSingleUser = (params) => {
    const userId = params.id;
    setLoading(true);
    httpClient
      .delete(`admin/subscriber/delete-subscriber/${userId}`)
      .then((res) => {
        setAlertMessage(res.data.message);
        setApiSuccess(true);
        setApiError(false);
        setCloseSnackBar(true);
        setStatus("deleted");
      })
      .catch((error) => {
        setAlertMessage(error.response?.data?.message || "Delete failed");
        setApiError(true);
        setApiSuccess(false);
        setCloseSnackBar(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    httpClient
      .get(
        `admin/subscriber/get-subscriber?page=${
          paginationModel.page + 1
        }&limit=${paginationModel.pageSize}`
      )
      .then((res) => {
        const data = res.data.data.data || [];
        setUserCount(res.data.data.total); // Set total count from API
        setRows(
          data.map((doc, index) => ({
            id: doc._id,
            col1: paginationModel.page * paginationModel.pageSize + (index + 1),
            col2: doc.email || doc.phone || "N/A",
            col3: doc.updatedAt?.substring(0, 10) || "N/A",
            col4: doc.createdAt?.substring(0, 10) || "N/A",
          }))
        );
      })
      .catch((error) => console.error("Fetch failed", error))
      .finally(() => setLoading(false));
  }, [paginationModel, status]); // Depend on pagination changes

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light">
        <AppHeader />
        <PageTitle title={t("Subscribers")} />

        <CContainer className="mt-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>{t("Subscribers")}</h4>
            <Select
              value={paginationModel.pageSize}
              onChange={(e) =>
                setPaginationModel({
                  ...paginationModel,
                  pageSize: Number(e.target.value),
                })
              }
              variant="outlined"
              size="small"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </div>

          <div style={{ height: "600px" }}>
            {loading ? (
              <Loader />
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                rowCount={userCount}
                paginationMode="server"
                pageSize={paginationModel.pageSize}
                page={paginationModel.page} // Keep it as `page`
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={(newModel) => {
                  setPaginationModel(newModel); // Properly update state
                }}
                loading={loading}
                autoHeight
                sx={{
                  "& .MuiDataGrid-row:nth-of-type(even)": {
                    backgroundColor: "#f9f9f9",
                  },
                  "& .MuiDataGrid-columnHeader": { backgroundColor: "#e0e0e0" },
                }}
              />
            )}
          </div>

          <Snackbar
            open={closeSnackBar}
            autoHideDuration={3000}
            message={alertMessage}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            ContentProps={{
              sx: apiSuccess
                ? { backgroundColor: "green", color: "white" }
                : { backgroundColor: "red", color: "white" },
            }}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setCloseSnackBar(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(Subscribers);
