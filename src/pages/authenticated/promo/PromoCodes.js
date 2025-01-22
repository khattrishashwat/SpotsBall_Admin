import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import httpClient from "../../../util/HttpClient";
import EditIcon from "@mui/icons-material/Edit";

const PromoCodes = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [closeSnackbar, setCloseSnackbar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const navigate = useNavigate();

  const columns = [
    { field: "col1", headerName: "#", width: 80 },
    { field: "col2", headerName: "Name", width: 150 },
    { field: "col3", headerName: "Min Ticket", width: 150 },
    { field: "col4", headerName: "Max Ticket", width: 180 },
    { field: "col5", headerName: "Discount", width: 180 },
    { field: "col6", headerName: "Status", width: 180 },
    { field: "col7", headerName: "Created At", width: 180 },
    { field: "col8", headerName: "Updated At", width: 180 },
    {
      field: "col9",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <EditIcon
            cursor="pointer"
            style={{ color: "gold", marginRight: "20px" }}
            onClick={() => navigate(`edit_coupons/${params.row.id}`)}
            titleAccess="Edit"
          />
          <DeleteIcon
            cursor="pointer"
            style={{ color: "red" }}
            onClick={() => confirmBeforeDelete(params.row.id)}
            titleAccess="Delete"
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    httpClient
      .get(`admin/discount/get-discount`)
      .then((res) => {
        const data = res.data?.data || [];
        setUserCount(data.length);
        setRows(
          data.map((record, index) => ({
            id: record._id,
            col1: paginationModel.page * paginationModel.pageSize + (index + 1),
            col2: record.name || "N/A",
            col3: record.minTickets || "N/A",
            col4: record.maxTickets || "N/A",
            col5: record.discountPercentage || "N/A",
            col6: record.isActive ? "Active" : "Inactive",
            col7: record.createdAt?.substring(0, 10) || "N/A",
            col8: record.updatedAt?.substring(0, 10) || "N/A",
          }))
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching promo codes:", error);
        setLoading(false);
      });
  }, [paginationModel]);

  const confirmBeforeDelete = (row) => {
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
          deletePromoCode(row.id);
        }
      });
  };

  const deletePromoCode = (id) => {
    setLoading(true);
    httpClient
      .delete(`admin/discount/delete-discount/${id}`)
      .then((res) => {
        setAlertMessage(res.data.message);
        setApiSuccess(true);
        setCloseSnackbar(true);
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        setUserCount((prevCount) => prevCount - 1);
        setLoading(false);
      })
      .catch((error) => {
        setAlertMessage(error.response?.data?.message || "An error occurred");
        setApiSuccess(false);
        setCloseSnackbar(true);
        setLoading(false);
      });
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Coupons" />
        <CContainer>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Discount Coupons:</h4>
            <Button
              variant="contained"
              style={{ backgroundColor: "orange" }}
              onClick={() => navigate("new_coupons")}
            >
              Add New Coupons
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
              open={closeSnackbar}
              autoHideDuration={3000}
              onClose={() => setCloseSnackbar(false)}
              message={alertMessage}
              ContentProps={{
                sx: apiSuccess
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "red" },
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  onClick={() => setCloseSnackbar(false)}
                >
                  <CloseIcon />
                </IconButton>
              }
            />
            <DataGrid
              sx={{
                "& .MuiDataGrid-row:nth-of-type(2n)": {
                  backgroundColor: "#f5f5f5",
                },
                "& .MuiDataGrid-columnHeader": { backgroundColor: "#f0f0f0" },
              }}
              rows={rows}
              columns={columns}
              rowCount={userCount}
              pagination
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              loading={loading}
              autoHeight
              disableRowSelectionOnClick
            />
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(PromoCodes);
