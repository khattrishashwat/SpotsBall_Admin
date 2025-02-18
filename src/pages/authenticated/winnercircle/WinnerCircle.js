import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import { CContainer } from "@coreui/react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  IconButton,
  Snackbar,
  Typography,
  Box,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import httpClient from "../../../util/HttpClient";

const WinnerCircle = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [closeSnackbar, setCloseSnackbar] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [userCount, setUserCount] = useState(0);

  const navigate = useNavigate();

  const columns = [
    { field: "col1", headerName: "#", width: 80 },
    { field: "col2", headerName: "Contest ID", width: 200 },
    {
      field: "col3",
      headerName: "Contest Image",
      width: 150,
      renderCell: (params) =>
        params.value !== "N/A" ? (
          <img
            src={params.value}
            alt="thumbnail"
            style={{
              width: 60,
              height: 40,
              objectFit: "cover",
              borderRadius: 5,
            }}
          />
        ) : (
          "-"
        ),
    },
    { field: "col4", headerName: "₹ Price", width: 100 },
    { field: "col5", headerName: "Max Tickets", width: 150 },
    { field: "col6", headerName: "Participants", width: 150 },
    { field: "col7", headerName: "End Date", width: 150 },
    {
      field: "col8",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span style={{ color: params.value ? "green" : "red" }}>
          {params.value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "col9",
      headerName: "Winner Calculated",
      width: 180,
      renderCell: (params) => (
        <span>{params.value ? "Calculated" : "Not Calculated"}</span>
      ),
    },
    {
      field: "col10",
      headerName: "Show",
      width: 120,
      // renderCell: (params) => {
      //   return (
      //     <Switch
      //       checked={params.row} // checked={params.row.col3 === true ? true : false}
      //       onChange={(e) => handleStatusChange(e, params.row)}
      //     />
      //   );
      // },
    },
    {
      field: "col11",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => navigate(`match-winner/${params.row.id}`)}
          >
            <EditIcon />
          </IconButton>
          {/* <IconButton
            color="error"
            onClick={() => confirmBeforeDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton> */}
        </>
      ),
    },
  ];

  const fetchContests = () => {
    setLoading(true);
    httpClient
      .get(
        `admin/contest/get-all-contest-details?page=${paginationModel.page}&limit=${paginationModel.pageSize}`
      )
      .then((res) => {
        const data = res.data.data;
        console.log("new", data);
        setUserCount(data.total);
        setRows(
          data.data.map((contestData, index) => ({
            id: contestData.contest._id,
            col1: paginationModel.page * paginationModel.pageSize + index + 1,
            col2: contestData.contest._id || "N/A",
            col3: contestData.contest.contest_banner?.file_url || "N/A",
            col4: contestData.contest.ticket_price || "N/A",
            col5: contestData.contest.maxTickets || "N/A",
            col6: contestData.userParticipated || "N/A",
            col7:
              contestData.contest.contest_end_date?.substring(0, 10) || "N/A",
            col8: contestData.contest.is_active,
            col9: contestData.contest.isWinnerCalculated,
          }))
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const confirmBeforeDelete = (row) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.isConfirmed) deleteContest(row.id);
      });
  };

  const deleteContest = (id) => {
    httpClient
      .delete(`/admin/delete-group/${id}`)
      .then((res) => {
        setAlertMessage(res.data.message);
        setApiSuccess(true);
        fetchContests();
      })
      .catch((err) => {
        setAlertMessage(err.response?.data?.message || "Failed to delete");
        setApiSuccess(false);
      })
      .finally(() => setCloseSnackbar(true));
  };

  useEffect(() => {
    fetchContests();
  }, [paginationModel]);

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
  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100">
        <AppHeader />
        <PageTitle title="Winner Circle" />
        <CContainer>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5">Announce Winner Circle</Typography>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("contest_management/add-contest")}
            >
              Add Contest
            </Button> */}
          </Box>
          <Box
            style={{
              height: 600,
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pagination
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={userCount} // Fix: Use total count from API response
              sx={{
                "& .MuiDataGrid-row:nth-of-type(2n)": {
                  backgroundColor: "#f9f9f9",
                },
              }}
            />
          </Box>
          <Snackbar
            open={closeSnackbar}
            autoHideDuration={3000}
            onClose={() => setCloseSnackbar(false)}
            message={alertMessage}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            ContentProps={{
              style: { backgroundColor: apiSuccess ? "green" : "red" },
            }}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setCloseSnackbar(false)}
              >
                <CloseIcon />
              </IconButton>
            }
          />
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(WinnerCircle);
