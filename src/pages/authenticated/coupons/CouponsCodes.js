import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, Snackbar, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import httpClient from "../../../util/HttpClient";
import EditIcon from "@mui/icons-material/Edit";

const CouponsCodes = () => {
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
    { field: "col3", headerName: "Amount", width: 150 },
    { field: "col4", headerName: "Active", width: 130 },

    { field: "col5", headerName: "Created At", width: 180 },
    { field: "col6", headerName: "Updated At", width: 180 },
    {
      field: "col7",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        return (
          <Switch
            checked={params.row.col3} // checked={params.row.col3 === true ? true : false}
            onChange={(e) => handleStatusChange(e, params.row)}
          />
        );
      },
    },
    {
      field: "col8",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <EditIcon
            cursor="pointer"
            style={{ color: "gold", marginRight: "20px" }}
            onClick={() => navigate(`edit_promo/${params.row.id}`)}
            titleAccess="Edit"
          />
          {/* <DeleteIcon
            cursor="pointer"
            style={{ color: "red" }}
            onClick={() => confirmBeforeDelete(params.row)}
            titleAccess="Delete"
          /> */}
        </>
      ),
    },
  ];
  const handleStatusChange = (e, params) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === params.id) {
          updateStatus(params.id, row.col3);
        }
        return row.id === params.id ? { ...row, col3: !row.col3 } : row;
      })
    );
  };

  const updateStatus = (id, status) => {
    console.log("id", id);
    console.log("status", status);

    httpClient
      .get(`admin/users/active-in-active-user/${id}`, {
        is_active: status === true ? false : true,
      })
      .then((res) => {
        console.log("update status ==> ", res);
        // setStatus("ok");
      });
  };

  useEffect(() => {
    setLoading(true);
    httpClient
      .get(`admin/promocode/get-promocode`)
      .then((res) => {
        const data = res.data?.data || [];
        setUserCount(data.length);
        setRows(
          data.map((record, index) => ({
            id: record._id,
            col1: paginationModel.page * paginationModel.pageSize + (index + 1),
            col2: record.name || "N/A",
            col3: record.amount || "N/A",

            col4: record.isActive ? "true" : "false",
            col5: record.createdAt?.substring(0, 10) || "N/A",
            col6: record.updatedAt?.substring(0, 10) || "N/A",
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
      .delete(`admin/promocode/delete-promocode/${id}`)
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
        <PageTitle title="Promo Codes" />
        <CContainer>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>PromoCodes:</h4>
            <Button
              variant="contained"
              style={{ backgroundColor: "orange" }}
              onClick={() => navigate("new_promo")}
            >
              Add New Promo Code
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

export default React.memo(CouponsCodes);
