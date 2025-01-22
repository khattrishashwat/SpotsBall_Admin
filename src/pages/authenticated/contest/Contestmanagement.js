import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";

const ContestManagement = () => {
  const [alertMessage, setAlertMessage] = useState();
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 12,
  });

  const navigate = useNavigate();

  const fetchContests = () => {
    setLoading(true);
    const { page, pageSize } = paginationModel;

    httpClient
      .get(`/admin/contest/get-all-contests?page=${page + 1}&limit=${pageSize}`)
      .then((res) => {
        const contests = res.data.data;
        setUserCount(res.data.total); // Total number of contests from the API
        setRows(
          contests.map((contest, index) => ({
            id: contest._id,
            col1: page * pageSize + (index + 1),
            col2: contest.title || "N/A",
            col3: contest.contest_banner?.file_url || "N/A",
            col4: contest.jackpot_price || "N/A",
            col5: contest.maxTickets || "N/A",
            col6: contest.contest_start_date
              ? contest.contest_start_date.substring(0, 10)
              : "N/A",
            col7: contest.contest_end_date
              ? contest.contest_end_date.substring(0, 10)
              : "N/A",
          }))
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchContests();
  }, [paginationModel]);

  const confirmBeforeDelete = (id) => {
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
          console.log(`Deleting contest with ID: ${id}`); // Log ID for debugging
          deleteSingleUser(id);
        }
      });
  };

  const deleteSingleUser = (id) => {
    httpClient
      .delete(`admin/contest/delete-contest/${id}`)
      .then((res) => {
        console.log(`Contest with ID: ${id} successfully deleted.`); // Success log
        setAlertMessage(res.data.message);
        setApiSuccess(true);
        setCloseSnakeBar(true);
        fetchContests(); // Refetch data after deletion
      })
      .catch((error) => {
        console.error(
          `Failed to delete contest with ID: ${id}. Error: `,
          error.response?.data?.message || error
        ); // Error log
        setAlertMessage(error.response?.data?.message || "Failed to delete");
        setApiError(true);
        setCloseSnakeBar(true);
      });
  };

  const columns = [
    { field: "col1", headerName: "#", width: 150 },
    { field: "col2", headerName: "Title", width: 205 },
    {
      field: "col3",
      headerName: "Image",
      width: 200,
      renderCell: (params) =>
        params.value !== "N/A" ? (
          <img
            style={{
              width: "70px",
              objectFit: "cover",
              cursor: "pointer",
            }}
            src={params.value}
            alt="thumbnail"
          />
        ) : (
          ""
        ),
    },
    { field: "col4", headerName: "Price", width: 120 },
    { field: "col5", headerName: "Max Ticket", width: 180 },
    { field: "col6", headerName: "Contest Start Date", width: 180 },
    { field: "col7", headerName: "Contest End Date", width: 180 },
    {
      field: "col8",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => navigate(`edit-contest/${params.row.id}`)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => confirmBeforeDelete(params.row.id)}
          >
            <DeleteIcon />
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
        <PageTitle title="Contest Management" />

        <CContainer>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="my-4">Contest Management</h4>
            <Button variant="contained" onClick={() => navigate("add-contest")}>
              Add Contest
            </Button>
          </div>

          <div
            style={{
              height: "900px",
              border: "1px solid gray",
              padding: 15,
              borderRadius: 5,
            }}
          >
            <Snackbar
              open={closeSnakeBar}
              autoHideDuration={3000}
              message={alertMessage}
              onClose={() => setCloseSnakeBar(false)}
              ContentProps={{
                sx: apiSuccess
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "red" },
              }}
            />

            <DataGrid
              rows={rows}
              columns={columns}
              rowCount={userCount}
              pagination
              paginationMode="server"
              paginationModel={paginationModel}
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

export default React.memo(ContestManagement);
