import React, { useEffect, useState } from "react";

import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Snackbar, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import Loader from "../../../components/loader/Loader";
import { CardMedia } from "@mui/material";
import styled from "styled-components";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";

const UserSubscription = () => {
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
  const [showImage, setShowIMage] = useState(false);
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
    httpClient
      .patch(`/admin/users/${id}`, {
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
            onMouseEnter={(e) => {
              setShowIMage(() => true);
              setProfilePicture(params.formattedValue);
            }}
            onMouseLeave={(e) => {
              setShowIMage(() => false);
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
            checked={params.row.col3 === true ? true : false}
            onChange={(e) => handleStatusChange(e, params.row)}
          />
        );
      },
    },
    { field: "col4", headerName: "Name", width: 200 },
    { field: "col5", headerName: "email", width: 200 },
    { field: "col6", headerName: "Phone Number", width: 160 },
    { field: "col7", headerName: "Created Date", width: 170 },
    {
      field: "col8",
      headerName: "Action",
      width: 125,
      renderCell: (params) => {
        return (
          <DeleteIcon
            cursor={"pointer"}
            style={{ color: "red" }}
            onClick={(e) => confirmBeforeDelete(e, params.row)}
          />
        );
      },
    },
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
      .delete(`/admin/users/delete/${userId}`)
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

  //fetching user information
  useEffect(() => {
    setLoading(true);
    httpClient
      .get(
        `/admin/users-subscription?page=${paginationModel.page}&pageSize=${paginationModel.pageSize}&search=${keyword}`
      )
      .then((res) => {
        console.log("subscription data ==> ", res);
        setUserCount(res.data?.result?.count);
        setLoading(false);
        setRows(
          res.data.result.map((user, index) => {
            return {
              id: user._id,
              col1:
                paginationModel.page * paginationModel.pageSize + (index + 1),

              col2: user.profile_picture || "N/A",
              col3: user.is_active || "false",
              col4: user.username || "User",
              col5: user.email || "Not Available",
              col6: user.phone || "Not Available",
              col7: user.created_at.substring(0, 10),
            };
          })
        );
        setStatus("");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, [paginationModel, alertMessage, status, keyword]);

  const handleRecordPerPage = (e) => {
    setLoading(true);
    paginationModel.pageSize = e.target.value;
    setPaginationModel({ ...paginationModel });
  };

  const handleSearch = (e) => {
    setLoading(true);
    let searchValue = e.target.value.trim();
    //if search keyword length is less than 1, reset the user info
    if (searchValue.length <= 0) {
      setPaginationModel({ page: 0, pageSize: 10 });
    }

    if (searchValue || searchValue === " ") {
      searchValue = searchValue.trim();
      // setSearch(searchValue);
      httpClient
        .get(`/admin/users?keyword=${searchValue}&key=${filterMode}`)
        .then((res) => {
          setUserCount(res.data.users.length);
          if (res.status === 200) {
            setLoading(false);
            setRows(
              res.data.users.map((user, index) => {
                return {
                  id: user._id,
                  col1: index + 1,
                  col2: user.name,
                  col3: user.email,
                  col4: user.mobile,
                  col5: user.createdAt.substring(0, 10),
                };
              })
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return;
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="User  Management" />
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
                  min={0}
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
                  className="ms-2 ps-1"
                  type="text"
                  name="search"
                  id="search"
                  placeholder="name..."
                  style={{
                    width: "100%",
                    outline: "none",
                    borderRadius: 5,
                    border: "1px solid gray",
                  }}
                  onChange={(e) => {
                    let keyword = e.target.value.trim();
                    setKeyword(keyword);
                  }}
                />
                {/* <select
                  onClick={(e) => setFilterMode(e.target.value)}
                  style={{ borderRadius: 5, outline: "none" }}
                >
                  <option disabled selected>select</option>
                  <option value={"name"}>name</option>
                  <option value="email">email</option>
                  <option value="mobile">mobile</option>
                </select> */}
              </CCol>
            </div>
            {showImage && (
              <Container>
                {profilePicture && (
                  <img
                    src={profilePicture}
                    alt="User"
                    style={{
                      // width: "%",
                      // height: "30%",
                      maxWidth: "100%",
                      maxHeight: "80%",
                      borderRadius: "2%",
                      objectFit: "contain",
                      // margin: "0 auto",
                    }}
                  />
                )}
              </Container>
            )}
            <DataGrid
              sx={{
                "& .MuiDataGrid-row:nth-of-type(2n)": {
                  backgroundColor: "#d5dbd6",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#d5dbd6",
                  // height: "40px !important",
                  outline: "none !important",
                },
                "& .MuiDataGrid-cell": {
                  outline: "none !important",
                },
              }}
              rows={rows}
              columns={columns}
              // pageSizeOptions={[5, 10, 15]}
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

export default React.memo(UserSubscription);

const Container = styled.div`
  position: absolute;
  top: 40%;
  left: 40%;
  z-index: 99;
  width: 35%;
  height: 35%;
`;
