import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, Snackbar } from "@mui/material";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ContestManagement = () => {
  const [alertMessage, setAlertMessage] = useState();
  const [apiSuccess, setApiSuccess] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchContests = () => {
    setLoading(true);
    httpClient
      .get(
        `/admin/contest/get-all-contests?page=${
          paginationModel.page + 1
        }&limit=${paginationModel.pageSize}`
      )
      .then((res) => {
        const contests = res.data.data;
        setUserCount(contests?.pagination?.total); // Total number of contests
        setRows(
          contests.data.map((contest, index) => ({
            id: contest._id,
            col1: paginationModel.page * paginationModel.pageSize + (index + 1), // ✅ Corrected calculation
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
            col8: contest.is_active,
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
  }, [paginationModel.page, paginationModel.pageSize]);

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
          deleteSingleUser(id);
        }
      });
  };

  const deleteSingleUser = (id) => {
    httpClient
      .delete(`admin/contest/delete-contest/${id}`)
      .then((res) => {
        setAlertMessage(res.data.message);
        setApiSuccess(true);
        setCloseSnakeBar(true);
        fetchContests(); // Refetch data after deletion
      })
      .catch((error) => {
        setAlertMessage(error.response?.data?.message || "Failed to delete");
        setApiSuccess(false);
        setCloseSnakeBar(true);
      });
  };

  const columns = [
    { field: "col1", headerName: "#", width: 150 },
    { field: "col2", headerName: t("Title"), width: 205 },
    {
      field: "col3",
      headerName: t("Image"),
      width: 200,
      renderCell: (params) =>
        params.value !== "N/A" ? (
          <img
            style={{ width: "70px", objectFit: "cover", cursor: "pointer" }}
            src={params.value}
            alt="thumbnail"
          />
        ) : (
          ""
        ),
    },
    { field: "col4", headerName: t("₹ Price"), width: 120 },
    { field: "col5", headerName: t("Max Ticket"), width: 180 },
    { field: "col6", headerName: t("Contest Start Date"), width: 180 },
    { field: "col7", headerName: t("Contest End Date"), width: 180 },
    {
      field: "col8",
      headerName: t("Status"),
      width: 120,
      renderCell: (params) => (
        <span style={{ color: params.value ? "green" : "red" }}>
          {params.value ? "Active" : "Inactive"}
        </span>
      ),
    },
    // {
    //   field: "col9",
    //   headerName: "Action",
    //   width: 200,
    //   renderCell: (params) => (
    //     <>
    //       <IconButton
    //         color="primary"
    //         onClick={() => navigate(`edit-contest/${params.row.id}`)}
    //       >
    //         <EditIcon />
    //       </IconButton>
    //     </>
    //   ),
    // },
    {
      field: "col9",
      headerName: t("Action"),
      width: 200,
      renderCell: (params) => {
        // Convert dates to Date objects
        const contestStartDate = new Date(params.row.col6);
        const contestEndDate = new Date(params.row.col7);
        const today = new Date();

        // Disable the edit button if the contest has started (ongoing or ended)
        const isDisabled = today >= contestStartDate;

        return (
          <IconButton
            color="primary"
            onClick={() => navigate(`edit-contest/${params.row.id}`)}
            disabled={isDisabled}
          >
            <EditIcon />
          </IconButton>
        );
      },
    },
  ];

  const handleRecordPerPage = (e) => {
    const newPageSize = e.target.value;
    setPaginationModel((page) => ({
      page: 1,
      pageSize: newPageSize,
    }));
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Contest Management" />

        <CContainer>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="my-4">{t("Contest Management")}</h4>
            <Button variant="contained" onClick={() => navigate("add-contest")}>
              {t("Add Contest")}
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
              pageSizeOptions={[10, 20, 50]} // Set valid page sizes
              paginationModel={paginationModel}
              onPaginationModelChange={(model) => {
                setPaginationModel({
                  page: model.page, // ✅ Keep it zero-based for MUI DataGrid
                  pageSize: model.pageSize,
                });
              }}
              loading={loading}
              autoHeight
              components={{
                NoRowsOverlay: () => <div>{t("No records to display")}</div>,
              }}
              disableSelectionOnClick
            />
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(ContestManagement);
