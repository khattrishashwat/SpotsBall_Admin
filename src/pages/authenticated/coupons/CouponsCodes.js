import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import httpClient from "../../../util/HttpClient";
import { CContainer } from "@coreui/react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, Snackbar, Switch } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const CouponsCodes = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    fetchPromoCodes();
  }, [paginationModel]);

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const res = await httpClient.get("admin/promocode/get-promocode");
      const data = res.data?.data || [];
      setRows(
        data.map((record, index) => ({
          id: record._id,
          index: paginationModel.page * paginationModel.pageSize + (index + 1),
          name: record.name || "N/A",
          amount: record.amount || "N/A",
          active: record.isActive,
          createdAt: record.createdAt?.substring(0, 10) || "N/A",
          updatedAt: record.updatedAt?.substring(0, 10) || "N/A",
        }))
      );
    } catch (error) {
      console.error("Error fetching promo codes:", error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (row) => {
    const updatedStatus = !row.active;
    setRows((prevRows) =>
      prevRows.map((r) =>
        r.id === row.id ? { ...r, active: updatedStatus } : r
      )
    );

    try {
      const res = await httpClient.patch(
        `admin/promocode/edit-promocode/${row.id}`,
        {
          name: row.name,
          amount: row.amount,
          isActive: updatedStatus,
        }
      );
      setAlertMessage(res.data.message || "Status updated successfully");
      setApiSuccess(true);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Error updating status");
      setApiSuccess(false);
      setRows((prevRows) =>
        prevRows.map((r) =>
          r.id === row.id ? { ...r, active: !updatedStatus } : r
        )
      );
    }
    setShowSnackbar(true);
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deletePromoCode(row.id);
    });
  };

  const deletePromoCode = async (id) => {
    setLoading(true);
    try {
      await httpClient.delete(`admin/promocode/delete-promocode/${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      setAlertMessage("Promo code deleted successfully");
      setApiSuccess(true);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "An error occurred");
      setApiSuccess(false);
    }
    setShowSnackbar(true);
    setLoading(false);
  };

  const columns = [
    { field: "index", headerName: "#", width: 80 },
    { field: "name", headerName: t("Name"), width: 150 },
    { field: "amount", headerName: t("Amount"), width: 150 },
    { field: "createdAt", headerName: t("Created At"), width: 180 },
    { field: "updatedAt", headerName: t("Updated At"), width: 180 },
    {
      field: "active",
      headerName: t("Status"),
      width: 120,
      renderCell: (params) => (
        <Switch
          checked={params.row.active}
          onChange={() => handleStatusChange(params.row)}
        />
      ),
    },
    {
      field: "actions",
      headerName: t("Actions"),
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`edit_promo/${params.row.id}`)}>
            <EditIcon style={{ color: "gold" }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Promo Codes" />
        <CContainer>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>{t("Promo Codes")}</h4>
            <Button
              variant="contained"
              style={{ backgroundColor: "grey" }}
              onClick={() => navigate("new_promo")}
            >
              {t("Old Promo Code")}
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "orange" }}
              onClick={() => navigate("new")}
            >
              {t(" New Promo Code")}
            </Button>
          </div>
          <div
            style={{
              height: "600px",
              border: "1px solid gray",
              padding: 15,
              borderRadius: 5,
            }}
          >
            <Snackbar
              open={showSnackbar}
              autoHideDuration={3000}
              onClose={() => setShowSnackbar(false)}
              message={alertMessage}
              ContentProps={{
                sx: apiSuccess
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "red" },
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              action={
                <IconButton
                  color="inherit"
                  onClick={() => setShowSnackbar(false)}
                >
                  <CloseIcon />
                </IconButton>
              }
            />
            <DataGrid
              rows={rows}
              columns={columns}
              pagination
              paginationMode="server"
              rowCount={rows.length}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              loading={loading}
              autoHeight
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-row:nth-of-type(2n)": {
                  backgroundColor: "#f5f5f5",
                },
                "& .MuiDataGrid-columnHeader": { backgroundColor: "#f0f0f0" },
              }}
            />
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(CouponsCodes);
