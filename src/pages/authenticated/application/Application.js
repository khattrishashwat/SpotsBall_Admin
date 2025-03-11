import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CContainer } from "@coreui/react";
import { useTranslation } from "react-i18next";

import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import { Snackbar, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert2";
import httpClient from "../../../util/HttpClient";
import { useNavigate } from "react-router-dom";

const Application = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
    const { t } = useTranslation();

  const [totalRecords, setTotalRecords] = useState(0);

  const navigate = useNavigate();

  const fetchSocialLinks = () => {
    setLoading(true);
    const { page, pageSize } = paginationModel;

    httpClient
      .get(`admin/apk-links/get-apk-links`)
      .then((res) => {
        const { data, total } = res.data;
        setRows(
          data.map((doc, index) => ({
            id: doc._id,
            col1: page * pageSize + (index + 1), // Serial number
            col2: "Android", // Platform
            col3: doc.android_build || "N/A", // Social Link
            clo4: doc.createdAt.substring(0, 10), // Created At (formatted)
            clo5: doc.updatedAt.substring(0, 10), // Updated At (formatted)
          }))
        );
        setTotalRecords(total);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSocialLinks();
  }, [paginationModel]);

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
        if (result.isConfirmed) deleteSingleLink(params);
      });
  };

  const deleteSingleLink = (params) => {
    const userId = params.id;
    httpClient
      .delete(`admin/apk-links/delete-apk-links/${userId}`)
      .then((res) => {
        setAlertMessage(res.data.message);
        setApiSuccess(true);
        setCloseSnakeBar(true);
        fetchSocialLinks();
      })
      .catch((error) => {
        setAlertMessage(error.response?.data?.message || "Failed to delete");
        setApiSuccess(false);
        setCloseSnakeBar(true);
      });
  };

  const columns = [
    { field: "col1", headerName: "#", width: 80 },
    { field: "col2", headerName: t("App"), width: 150 },
    { field: "col3", headerName: t("Apk Link"), width: 350 },
    { field: "clo4", headerName: t("Created At"), width: 180 },
    { field: "clo5", headerName: t("Updated At"), width: 180 },
    {
      field: "clo6",
      headerName: t("Action"),
      width: 200,
      renderCell: (params) => (
        <>
          <EditIcon
            style={{ color: "gold", cursor: "pointer", marginRight: "15px" }}
            onClick={() => navigate(`edit-application/${params.row.id}`)}
          />
          <Button
            variant="outlined"
            color="error"
            onClick={() => confirmBeforeDelete(params.row)}
          >
            {t("Delete")}
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light">
        <AppHeader />
        <PageTitle title={t("Application Links")} />
        <CContainer>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>{t("Appication Links")}</h4>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("add-application")}
            >
              {t("Add APP Link")}
            </Button>
          </div>

          <div style={{ height: "600px", width: "100%" }}>
            <Snackbar
              open={closeSnakeBar}
              autoHideDuration={3000}
              message={alertMessage}
              onClose={() => setCloseSnakeBar(false)}
              ContentProps={{
                sx: { backgroundColor: apiSuccess ? "green" : "red" },
              }}
              action={
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => setCloseSnakeBar(false)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            />
            <DataGrid
              rows={rows}
              columns={columns}
              pagination
              paginationMode="server"
              rowCount={totalRecords}
              // pageSizeOptions={[5, 10, 20]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              loading={loading}
              sx={{
                "& .MuiDataGrid-row:nth-of-type(odd)": {
                  backgroundColor: "#f5f5f5",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#d5dbd6",
                },
              }}
            />
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(Application);
