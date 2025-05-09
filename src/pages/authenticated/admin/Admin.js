import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Snackbar, Button, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import Loader from "../../../components/loader/Loader";
import { CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GridOverlay } from "@mui/x-data-grid";
import { Typography } from "@mui/material";

const CustomNoRowsOverlay = () => {
  const { t } = useTranslation();

  return (
    <GridOverlay>
      <Typography variant="h6" color="textSecondary">
        {t("No data found")}
      </Typography>
    </GridOverlay>
  );
};

const Admin = () => {
  const { t } = useTranslation();

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
  const navigate = useNavigate();

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
      headerName: t("Profile"),
      width: 140,
      renderCell: (params) => {
        const hasImage =
          params.formattedValue && params.formattedValue !== "N/A";
        const imageSrc = hasImage
          ? params.formattedValue
          : `${process.env.PUBLIC_URL}/images/user_image.png`;
        return (
          <img
            src={imageSrc}
            alt="profile"
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onMouseEnter={() => {
              if (hasImage) {
                setShowImage(true);
                setProfilePicture(params.formattedValue);
              }
            }}
            onMouseLeave={() => {
              if (hasImage) {
                setShowImage(false);
              }
            }}
          />
        );
      },
    },
    { field: "col3", headerName: t("Name"), width: 120 },
    { field: "col4", headerName: t("Email"), width: 200 },
    { field: "col5", headerName: t("Phone Number"), width: 160 },
    { field: "col6", headerName: t("Status"), width: 130 },
    {
      field: "col7",
      headerName: t("In-Active/Active"),
      width: 180,
      renderCell: (params) => {
        return (
          <Switch
            checked={params.row.col3}
            onChange={(e) => handleStatusChange(e, params.row)}
          />
        );
      },
    },
    { field: "col8", headerName: t("Visit Count"), width: 170 },
    { field: "col9", headerName: t("Last Visit"), width: 170 },
    { field: "col10", headerName: t("Created Date"), width: 170 },
    // {
    //   field: "col11",
    //   headerName: t("Action"),
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
          // `admin/users/get-all-users?page=${paginationModel.page}&limit=${
          //   paginationModel.pageSize
          // }&search=${keyword.trim()}`
          // ()
          `admin/auth/get-admins`
        )
        .then((response) => {
          const data = response.data.data || {};
          setUserCount(data.pagination?.totalUsers || 0);

          const users = data || [];
          setRows(
            users.map((user, index) => ({
              id: user._id,
              col1:
                paginationModel.page * paginationModel.pageSize + (index + 1), // Updated this line
              col2: user.profile_url || "N/A",
              col3: user.name,
              col4: user.email || "Not Available",
              col5: user.phone || "Not Available",
              col8: user.login_count ?? "Not Available",
              col9: user.last_login
                ? new Date(user.last_login).toLocaleString()
                : "Not Available",
              col10: user.createdAt
                ? new Date(user.createdAt).toISOString().substring(0, 10)
                : "N/A",
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
      <div className="wraper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title={t("Admin Management")} />
        <CContainer>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="my-4">{t("Admin")}</h4>
            <Button
              variant="contained"
              onClick={() => navigate("add-new-admin")}
            >
              {t("Add New Admin")}
            </Button>
          </div>
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
                {t("Show")}
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
                {t("Records per page")}
              </CCol>
              <CCol
                xs={6}
                style={{
                  width: "30%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {t("Search:")}
                <input
                  type="text"
                  name="search"
                  className="form-control form-control-sm"
                  style={{ fontSize: "13px", marginLeft: "10px" }}
                  onChange={handleSearch}
                  placeholder={t("Search by name, email, phone, etc.")}
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

export default Admin;
