import React, { useEffect, useState } from "react";
import AppSidebar from "../../components/AppSidebar";
import AppHeader from "../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Snackbar, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../util/HttpClient";
import swal from "sweetalert2";
import Loader from "../../components/loader/Loader";
import { CardMedia } from "@mui/material";
import styled from "styled-components";
import { GridOverlay } from "@mui/x-data-grid";
import { Typography } from "@mui/material";

const CustomNoRowsOverlay = () => {
  return (
    <GridOverlay>
      <Typography variant="h6" color="textSecondary">
        No data found
      </Typography>
    </GridOverlay>
  );
};

const UserData = () => {
  const [alertMessage, setAlertMessage] = useState();
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // Set pagination to start from 1
    pageSize: 10,
  });
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

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
        setStatus("ok");
      });
  };

  const columns = [
    { field: "col1", headerName: "#", width: 80 },
    {
      field: "col2",
      headerName: "Profile",
      width: 140,
      renderCell: (params) => {
        return params.formattedValue !== "N/A" ? (
          <img
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            src={params.formattedValue}
            alt="profile"
            onMouseEnter={() => {
              setShowImage(true);
              setProfilePicture(params.formattedValue);
            }}
            onMouseLeave={() => {
              setShowImage(false);
            }}
          />
        ) : (
          <img
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
              background: "transparent",
            }}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp0xKoXUryp0JZ1Sxp-99eQiQcFrmA1M1qbQ&s"
            alt="profile"
          />
        );
      },
    },
    {
      field: "col3",
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
    { field: "col4", headerName: "Name", width: 200 },
    { field: "col5", headerName: "email", width: 200 },
    { field: "col6", headerName: "Phone Number", width: 160 },
    { field: "col7", headerName: "Created Date", width: 170 },
    // {
    //   field: "col8",
    //   headerName: "Action",
    //   width: 125,
    //   renderCell: (params) => {
    //     return (
    //       <DeleteIcon
    //         cursor={"pointer"}
    //         style={{ color: "red" }}
    //         onClick={(e) => confirmBeforeDelete(e, params.row)}
    //       />
    //     );
    //   },
    // },
  ];

  //handle get confirmation before delete user
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
    const userId = params.id;
    httpClient
      .delete(`admin/users/delete-user/${userId}`)
      .then((res) => {
        setAlertMessage(res.data.message);
        setApiSuccess(true);
        setApiError(false);
        setLoading(false);
        setCloseSnakeBar(true);
        setStatus("deleted");

        // Remove the deleted user from the rows array
        setRows((prevRows) => prevRows.filter((row) => row.id !== userId));
      })
      .catch((error) => {
        setAlertMessage(error.response.data.message);
        setApiError(true);
        setApiSuccess(false);
        setCloseSnakeBar(true);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    setKeyword(value); // Update keyword
    setPaginationModel({ page: 1, pageSize: paginationModel.pageSize }); // Reset pagination to start from page 1
  };

  //fetching user information
  useEffect(() => {
    const fetchUsers = () => {
      setLoading(true);

      httpClient
        .get(
          `admin/users/get-all-users?page=${paginationModel.page}&limit=${
            paginationModel.pageSize
          }&search=${keyword.trim()}`
        )
        .then((response) => {
          const data = response.data.data || {};
          setUserCount(data.pagination?.totalUsers || 0);

          const users = data.users || [];
          setRows(
            users.map((user, index) => ({
              id: user._id,
              col1:
                paginationModel.page * paginationModel.pageSize + (index + 1), // Updated this line
              col2: user.profile_url || "N/A",
              col3: user.is_active,
              col4: `${user.first_name || "User"} ${
                user.last_name || ""
              }`.trim(),
              col5: user.email || "Not Available",
              col6: user.phone || "Not Available",
              col7: user.createdAt?.substring(0, 10) || "N/A",
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (keyword.length > 1 || keyword === "") {
      fetchUsers();
    }
  }, [keyword, paginationModel]);

  const handleRecordPerPage = (e) => {
    const newPageSize = e.target.value;
    setPaginationModel((prevState) => ({
      ...prevState,
      pageSize: newPageSize,
    }));
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="User Management" />
        <CContainer>
          <h4 className="">Users</h4>
          <div
            style={{
              minHeight: "300px",
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
            <div
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
              }}
            >
              <CCol xs={5}>
                Show
                <input
                  className="mx-2"
                  type="number"
                  id="number"
                  name="number"
                  placeholder="10"
                  defaultValue={"10"}
                  outline="none"
                  title="Enter a Number"
                  cursor="pointer"
                  min={1}
                  style={{
                    width: "45px",
                    outline: "none",
                    borderRadius: 5,
                    border: "1px solid gray",
                    fontSize: "1rem",
                    fontWeight: 600,
                    textAlign: "center",
                    height: 25,
                  }}
                  onChange={handleRecordPerPage}
                />
                Records per page
              </CCol>
              <CCol
                xs={6}
                style={{
                  width: "30%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Search:
                <input
                  type="text"
                  name="search"
                  className="form-control form-control-sm"
                  style={{ fontSize: "13px", marginLeft: "10px" }}
                  onChange={handleSearch}
                  placeholder="Search by name, email, phone, etc."
                />
              </CCol>
            </div>
            {loading ? (
              <Loader />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "400px",
                  borderRadius: "5px",
                  border: "1px solid gray",
                  padding: "5px",
                }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={paginationModel.pageSize}
                  page={paginationModel.page - 1}
                  pagination
                  paginationMode="server"
                  rowCount={userCount}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  components={{
                    NoRowsOverlay: CustomNoRowsOverlay,
                  }}
                  disableSelectionOnClick
                />
              </div>
            )}
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default UserData;
