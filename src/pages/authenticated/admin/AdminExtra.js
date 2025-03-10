import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import { CContainer } from "@coreui/react";
import Card from "./Cards";
import httpClient from "../../../util/HttpClient";
import BarGraph from "./BarGraph";
import { Snackbar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const AdminExtra = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [adminRows, setAdminRows] = useState([]);
  const [userRows, setUserRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const Admincolumns = [
    { field: "col1", headerName: "#", width: 150 },
    { field: "col2", headerName: "Country", width: 205 },
    {
      field: "col3",
      headerName: "Member",
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
    { field: "col5", headerName: "Name", width: 120 },
    { field: "col6", headerName: "Hours", width: 120 },
    { field: "col7", headerName: "Month", width: 180 },
    { field: "col8", headerName: "Revenue", width: 180 },
  ];

  const Usercolumns = [
    { field: "col1", headerName: "#", width: 150 },
    { field: "col2", headerName: "User Name", width: 205 },
    {
      field: "col3",
      headerName: "Image",
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
    { field: "col4", headerName: "Total Spent", width: 120 },
    { field: "col5", headerName: "Max Ticket", width: 180 },
    { field: "col6", headerName: "Phone", width: 180 },
    { field: "col7", headerName: "Winner", width: 180 },
  ];

  useEffect(() => {
    httpClient
      .get("/admin/dashboard")
      .then((res) => {
        if (res.data?.data) {
          const fetchedData = res.data.data;
          setData(fetchedData);

          setAdminRows(fetchedData.admins || []);
          setUserRows(fetchedData.users || []);

          setAdminCount(fetchedData.admins?.length || 0);
          setUserCount(fetchedData.users?.length || 0);
        }
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setAlertMessage("Failed to load data");
        setApiSuccess(false);
        setCloseSnakeBar(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCloseSnackbar = () => setCloseSnakeBar(false);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Admins Details" />
        <Card data={data} />
        <BarGraph data={data} />

        <CContainer>
          <h4>Admin</h4>
          <div
            style={{
              height: "300px",
              border: "1px solid gray",
              padding: 15,
              borderRadius: 5,
            }}
          >
            <Snackbar
              open={closeSnakeBar}
              autoHideDuration={3000}
              message={alertMessage}
              onClose={handleCloseSnackbar}
              ContentProps={{
                sx: apiSuccess
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "red" },
              }}
            />

            <DataGrid
              rows={adminRows}
              columns={Admincolumns}
              //   rowCount={adminCount}
              loading={loading}
              autoHeight
              components={{
                NoRowsOverlay: () => <div>No Admin records to display</div>,
              }}
              disableSelectionOnClick
            />
          </div>
        </CContainer>

        <CContainer>
          <h4>Users</h4>
          <div
            style={{
              height: "300px",
              border: "1px solid gray",
              padding: 15,
              borderRadius: 5,
            }}
          >
            <Snackbar
              open={closeSnakeBar}
              autoHideDuration={3000}
              message={alertMessage}
              onClose={handleCloseSnackbar}
              ContentProps={{
                sx: apiSuccess
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "red" },
              }}
            />

            <DataGrid
              rows={userRows}
              columns={Usercolumns}
              //   rowCount={userCount}
              loading={loading}
              autoHeight
              components={{
                NoRowsOverlay: () => <div>No User records to display</div>,
              }}
              disableSelectionOnClick
            />
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default AdminExtra;
