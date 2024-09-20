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
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

const Content = () => {
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

  const [status, setStatus] = useState("");

  const navigate = useNavigate();

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
    { field: "col1", headerName: "#", width: 200 },
    {
      field: "col2",
      headerName: "Title",
      width: 400,
    },
    {
      field: "col3",
      headerName: "Created At",
      width: 200,
    },
    {
      field: "col4",
      headerName: "Updated At",
      width: 200,
    },
    {
      field: "col5",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <EditIcon
              cursor={"pointer"}
              style={{
                color: "orange",
                background: "transparent",
                padding: "5px",
                fontWeight: "700",
                fontSize: "2rem",
              }}
              className="border-0 me-2"
              onClick={() => {
                console.log("edit content ==> ", params.row);
                navigate(`/content/edit-content/${params.row.id}`);
              }}
            />
            <DeleteIcon
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
    httpClient
    .delete(`/admin/delete-content/${params.id}`)
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
      .get(`/admin/get-all-content`)
      .then((res) => {
        setUserCount(res.data?.result?.count);
        setLoading(false);
        setRows(
          res.data.result.map((doc, index) => {
            return {
              id: doc._id,
              col1: paginationModel.page * paginationModel.pageSize + (index + 1),
              col2: doc.title || "N/A",
              col3: doc.created_at.substring(0, 10),
              col4: doc.updated_at.substring(0, 10),
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
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Content Page" />

        <CContainer>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="">Contents : </h4>
            <Button
              variant="contained"
              className="my-2"
              sx={{
                backgroundColor: "orange",
              }}
              onClick={() => {
                window.location.href = "content/new-content";
              }}
            >
              Add Content
            </Button>
          </div>
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
              {/* <CCol xs={5}>
                <button
                  onClick={() => {
                    console.log("add content");
                    navigate("/content/new-content");
                  }}
                  className="border-0 p-2 px-3"
                  style={{
                    backgroundColor: "#484a7d",
                    color: "#ffff",
                    padding: "5px",
                    fontWeight: "700",
                    borderRadius: "5px",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#3a3c6c !important",
                    },
                  }}
                >
                  New Content
                </button>
              </CCol> */}
              {/* <CCol
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
              </CCol> */}
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
              // pageSizeOptions={[10, 15, 20]}
              // rowCount={userCount}
              disableRowSelectionOnClick
              pagination={false}
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

export default React.memo(Content);
