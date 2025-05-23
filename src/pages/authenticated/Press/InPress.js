import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  IconButton,
  Snackbar,
  CircularProgress,
  Typography,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CustomNoRowsOverlay = () => {
  return (
    <GridOverlay>
      <Typography variant="h6" color="textSecondary">
        No data found
      </Typography>
    </GridOverlay>
  );
};

const InPress = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const columns = [
    { field: "col1", headerName: "#", width: 80 },
    {
      field: "col2",
      headerName: "Title",
      width: 250,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
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
        `admin/press/get-press?page=${paginationModel.page + 1}&limit=${
          paginationModel.pageSize
        }`
      )
      .then((res) => {
        const data = res.data.data;
        setUserCount(data?.pagination?.total);
        setRows(
          data.data.map((user, index) => ({
            id: user._id,
            col1: paginationModel.page * paginationModel.pageSize + (index + 1),
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, [paginationModel, status]);

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
        setCloseSnakeBar(true);
        setStatus("deleted");
      })
      .catch((error) => {
        setAlertMessage(error.response.data.message);
        setApiError(true);
        setApiSuccess(false);
        setCloseSnakeBar(true);
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
            <h4 className="">Blog :</h4>
            <Button
              variant="contained"
              className="my-2"
              sx={{ backgroundColor: "orange" }}
              onClick={() => navigate("add-blogs")}
            >
              Add Press
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
              open={closeSnakeBar}
              autoHideDuration={1000}
              message={alertMessage}
              onClose={() => {
                setCloseSnakeBar(false);
                setAlertMessage("");
                setApiError(false);
                setApiSuccess(false);
              }}
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
                <IconButton
                  aria-label="close"
                  color="inherit"
                  sx={{ p: 0.5 }}
                  onClick={() => setCloseSnakeBar(false)}
                >
                  <CloseIcon />
                </IconButton>
              }
            />

            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 30,
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <DataGrid
                sx={{
                  "& .MuiDataGrid-row:nth-of-type(2n)": {
                    backgroundColor: "#f5f5f5",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-cell": {
                    color: "#333",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
                rows={rows}
                columns={columns}
                rowCount={userCount}
                pageSize={paginationModel.pageSize}
                page={paginationModel.page}
                pagination
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                components={{
                  NoRowsOverlay: CustomNoRowsOverlay,
                }}
                disableSelectionOnClick
              />
            )}
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(InPress);
