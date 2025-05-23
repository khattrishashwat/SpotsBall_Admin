import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import Loader from "../../../components/loader/Loader";
import axios from "axios";
import { Visibility } from "@mui/icons-material";
import { useTranslation } from "react-i18next";



const View = (props) => {
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
  const { t } = useTranslation();

  const [filterMode, setFilterMode] = useState("name");
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleSelect = (e) => {
    httpClient
      .patch(`/admin/users/${e.target.id}`, {
        is_active: e.target.value === "active" ? true : false,
      })
      .then((res) => {
        console.log("update status ==> ", res);
        setStatus("ok");
      });
  };

  const columns = [
    { field: "col1", headerName: "#", width: 100 },
    // { field: "col2", headerName: "Title", width: 200 },
    {
      field: "col2",
      headerName: "User",
      width: 250,
    },
    {
      field: "col3",
      headerName: "Phone",
      width: 200,
    },
    {
      field: "col4",
      headerName: "Message",
      width: 415,
    },
    {
      field: "col5",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Visibility
              cursor={"pointer"}
              style={{ color: "green" }}
              onClick={(e) => console.log("view ==> ", e, params.row)}
            />
            <DeleteIcon
              className="ms-3"
              cursor={"pointer"}
              style={{ color: "red" }}
              onClick={(e) => confirmBeforeDelete(e, params.row)}
            />
          </>
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
    httpClient
      .get(`/admin/feedbacks`)
      .then((res) => {
        console.log("content => ", res);
        setUserCount(res.data?.result?.count);
        setLoading(false);
        setRows(
          res.data.result?.docs.map((doc, index) => {
            return {
              id: doc._id,
              col1: index + 1,
              col2: doc?.user_id?.username || "N/A",
              col3: doc?.user_id?.phone || "N/A",
              col4: doc.message || "N/A",
              col5: doc.created_at.substring(0, 10),
              //   col4: doc.username || "N/A",
            };
          })
        );
        setStatus("");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const handleRecordPerPage = (e) => {
    setLoading(true);
    paginationModel.pageSize = e.target.value;
    setPaginationModel({ ...paginationModel });
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 m-2 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="groups" />

        <CContainer>
          <h4 className="">Content</h4>
          <div
            style={{
              height: "600px",
              minHeight: "600px",
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
              </CCol>
            </div>
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
                "& .MuiDataGrid-row": {
                  outline: "none !important",
                  //   backgroundColor: "gold",
                },
              }}
              rows={rows}
              columns={columns}
              // pageSizeOptions={[5, 10, 15]}
              rowCount={userCount}
              disableRowSelectionOnClick
              //   pagination
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

export default React.memo(View);
