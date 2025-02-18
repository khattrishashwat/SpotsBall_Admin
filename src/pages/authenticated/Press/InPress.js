import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, Snackbar, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

const InPress = () => {
  const [alertMessage, setAlertMessage] = useState();
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });

  const [filterMode, setFilterMode] = useState("name");
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

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
    { field: "col2", headerName: "Title", width: 250 },
    {
      field: "col3",
      headerName: "Image",
      width: 200,
      renderCell: (params) =>
        params.formattedValue !== "N/A" ? (
          <img
            style={{ width: "70px", objectFit: "cover", cursor: "pointer" }}
            src={params.formattedValue}
            alt="thumbnail"
          />
        ) : null,
    },
    {
      field: "col4",
      headerName: "Link",
      width: 180,
      renderCell: (params) =>
        params.formattedValue !== "N/A" ? (
          <button
            onClick={() => window.open(params.formattedValue, "_blank")}
            style={{
              padding: "5px 10px",
              color: "white",
              backgroundColor: "blue",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Open Link
          </button>
        ) : (
          "N/A"
        ),
    },
    { field: "col5", headerName: "Created At", width: 180 },
    { field: "col6", headerName: "Updated At", width: 180 },
    {
      field: "col7",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <EditIcon
            cursor="pointer"
            style={{ color: "gold", marginRight: "20px" }}
            onClick={() => navigate(`edit-blogs/${params.row.id}`)}
            titleAccess="Edit"
          />
          <DeleteIcon
            cursor="pointer"
            style={{ color: "red" }}
            onClick={(e) => confirmBeforeDelete(e, params.row)}
            titleAccess="Delete"
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    httpClient
      .get(
        `admin/press/get-press?page=${paginationModel.page}&limit=${paginationModel.pageSize}`
      )
      .then((res) => {
        const data = res.data.data;
        setUserCount(data?.pagination?.total); // Total number of records
        setLoading(false);
        setRows(
          data.data.map((user, index) => ({
            id: user._id,
            col1:
              (paginationModel.page - 1) * paginationModel.pageSize +
              (index + 1),
            col2: user.title || "N/A",
            col3: user.press_banner || "N/A",
            col4: user.link || "N/A",
            col5: user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A",
            col6: user.updatedAt
              ? new Date(user.updatedAt).toLocaleDateString()
              : "N/A",
          }))
        );
        setStatus("");
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, [paginationModel, alertMessage, status, keyword]);

  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPaginationModel({ page: 1, pageSize: newPageSize }); // Reset to page 0 when changing size
  };

  // Handle confirmation before deleting
  const confirmBeforeDelete = (e, params) => {
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
          deleteSingleUser(e, params);
        }
      });
  };

  const deleteSingleUser = (e, params) => {
    const groupId = params.id;
    httpClient
      .delete(`admin/press/delete-press/${groupId}`)
      .then((res) => {
        setAlertMessage(res.data.message);
        setApiSuccess(true);
        setApiError(false);
        setLoading(false);
        setCloseSnakeBar(true);
        setStatus("deleted");
      })
      .catch((error) => {
        setAlertMessage(error.response.data.message);
        setApiError(true);
        setApiSuccess(false);
        setCloseSnakeBar(true);
        setLoading(false);
      });
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Blog" />

        <CContainer>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="">Blog : </h4>
            <Button
              variant="contained"
              className="my-2"
              sx={{
                backgroundColor: "orange",
              }}
              onClick={() => navigate("add-blogs")}
            >
              Add Press
            </Button>
          </div>
          <div
            style={{
              height: "600px",
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
                  backgroundColor: "#f5f5f5", // Light background for even rows
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#f0f0f0", // Header background
                  color: "#333",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-cell": {
                  color: "#333",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f0f0f0", // Hover effect
                },
              }}
              rows={rows}
              columns={columns}
              rowCount={userCount}
              paginationMode="server"
              pageSizeOptions={[10, 20, 30]}
              pageSize={paginationModel.pageSize}
              page={paginationModel.page}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={loading}
              autoHeight
              components={{
                LoadingOverlay: () => (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ),
              }}
            />
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(InPress);
