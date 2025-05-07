import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CustomNoRowsOverlay = () => {
  const { t } = useTranslation();

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
  const { t } = useTranslation();

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
      headerName: t("Profile"),
      width: 110,
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
    {
      field: "col3",
      headerName: t("In-Active/Active"),
      width: 130,
      renderCell: (params) => {
        return (
          <Switch
            checked={params.row.col3}
            onChange={(e) => handleStatusChange(e, params.row)}
          />
        );
      },
    },
    { field: "col4", headerName: t("Name"), width: 150 },
    { field: "col5", headerName: t("Email"), width: 200 },
    { field: "col6", headerName: t("Phone Number"), width: 160 },
    { field: "col7", headerName: t("Account Delete"), width: 130 },
    { field: "col8", headerName: t("Log Count's"), width: 120 },
    { field: "col9", headerName: t("Last Login"), width: 170 },
    { field: "col10", headerName: t("Created Date"), width: 170 },
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
                paginationModel.page * paginationModel.pageSize + (index + 1),
              col2: user.profile_url || null, // keep null instead of "N/A"
              col3: user.is_active,
              col4: `${user.first_name || "User"} ${
                user.last_name || ""
              }`.trim(),
              col5: user.email || "Not Available",
              col6: user.phone
                ? `${user.country_code || ""} ${user.phone}`
                : "Not Available",
              col7: user.isDeleted ? "Yes" : "No",
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

  const exportToExcel = () => {
    const exportData = rows.map((row) => ({
      Name: row.col4,
      Email: row.col5,
      "Phone Number": row.col6,
      "Is Active": row.col3 ? "Active" : "Deactivated",
      Deleted: row.col7,
      "Visit Time": row.col8,
      "Last Login": row.col9,
      "Created Date": row.col10,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "UserData.xlsx");
  };

  return (
    <>
      <AppSidebar />
      <div className="wraper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title={t("User Management")} />

        <CContainer>
          <h4 style={{ marginBottom: "-3%" }}>{t("Users")}</h4>
          <button
            onClick={exportToExcel}
            style={{
              padding: "6px 12px",
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
              marginLeft: "80%",
            }}
          >
            📥 Export to Excel
          </button>
          <div
            style={{
              minHeight: "700px",
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
                  height: "600px",
                  borderRadius: "5px",
                  border: "1px solid gray",
                  padding: "5px",
                }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  rowCount={userCount}
                  pageSize={paginationModel.pageSize}
                  page={paginationModel.page - 1}
                  pagination
                  paginationMode="server"
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[10, 50, 100]}
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
