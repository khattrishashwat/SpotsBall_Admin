import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import Loader from "../../../components/loader/Loader";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const [alertMessage, setAlertMessage] = useState();
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
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
        setStatus("ok");
      });
  };

  const columns = [
    { field: "col1", headerName: "#", width: 80 },
    { field: "col2", headerName: "Jackpot Price", width: 250 },
    { field: "col3", headerName: "Ticket Count", width: 150 },
    { field: "col4", headerName: "Ticket Price", width: 180 },
    { field: "col5", headerName: "Created At", width: 180 },
    { field: "col6", headerName: "Updated At", width: 180 },
    {
      field: "col7",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <VisibilityIcon
            cursor="pointer"
            style={{ color: "gold", marginRight: "20px" }}
            onClick={() => navigate(`payment-singlecontest/${params.row.id}`)}
            titleAccess="See"
          />
          {/* <DeleteIcon
            cursor="pointer"
            style={{ color: "red" }}
            onClick={(e) => confirmBeforeDelete(e, params.row)}
            titleAccess="Delete"
          /> */}
        </>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    httpClient
      .get(`/admin/get-all-contests`)
      .then((res) => {
        setUserCount(res.data.data.length);
        setLoading(false);

        setRows(
          res.data.data.map((record, index) => ({
            id: record._id,
            col1: paginationModel.page * paginationModel.pageSize + (index + 1),
            col2: record.jackpot_price || "N/A",
            col3: record.maxTickets || "N/A",
            col4: record.ticket_price || "N/A",
            col5: record.createdAt
              ? new Date(record.createdAt).toLocaleDateString()
              : "N/A",
            col6: record.updatedAt
              ? new Date(record.updatedAt).toLocaleDateString()
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

  // Handle get confirmation before delete
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
      .delete(`delete-press/${groupId}`)
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

  // Handle records per page
  const handleRecordPerPage = (e) => {
    setLoading(true);
    paginationModel.pageSize = e.target.value;
    setPaginationModel({ ...paginationModel });
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Payments" />

        <CContainer>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Payments Details:</h4>
          </div>

          <div
            style={{
              // height: "600px",
              minHeight: "600px",
              border: "0px solid gray",
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
                  backgroundColor: "#d5dbd6",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#d5dbd6",
                },
                "& .MuiDataGrid-cell": {
                  outline: "none !important",
                },
              }}
              rows={rows}
              columns={columns}
              rowCount={userCount}
              disableRowSelectionOnClick
              pagination
              paginationMode="server"
              paginationModel={paginationModel}
              disableColumnMenu
              onPaginationModelChange={setPaginationModel}
              loading={loading}
              autoHeight
            />
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(Payments);
