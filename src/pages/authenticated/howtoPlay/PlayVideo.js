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
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const PlayVideo = () => {
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
    { field: "col1", headerName: "#", width: 150 },
    { field: "col2", headerName: "Title", width: 205 },
    {
      field: "col3",
      headerName: "Image",
      width: 200,
      renderCell: (params) => {
        return params.formattedValue !== "N/A" ? (
          <img
            style={{
              width: "70px",
              objectFit: "cover",
              cursor: "pointer",
            }}
            src={params.formattedValue}
            alt="thumbnail"
          />
        ) : (
          ""
        );
      },
    },
    {
      field: "col4",
      headerName: "Video(Web)",
      width: 180,
      renderCell: (params) =>
        params.formattedValue !== "N/A" ? (
          <button
            onClick={() => window.open(params.formattedValue, "_blank")}
            style={{
              padding: "5px 10px",
              color: "white",
              backgroundColor: "blue",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Watch Video
          </button>
        ) : (
          "N/A"
        ),
    },
    {
      field: "col5",
      headerName: "Video(App)",
      width: 180,
      renderCell: (params) =>
        params.formattedValue !== "N/A" ? (
          <button
            onClick={() => window.open(params.formattedValue, "_blank")}
            style={{
              padding: "5px 10px",
              color: "white",
              backgroundColor: "blue",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Watch Video
          </button>
        ) : (
          "N/A"
        ),
    },
    {
      field: "col6",
      headerName: "Created At",
      width: 180,
    },
    {
      field: "col7",
      headerName: "Updated At",
      width: 180,
    },
    {
      field: "col8",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <EditIcon
            cursor={"pointer"}
            style={{ color: "gold", marginRight: "20px" }}
            onClick={() => navigate(`edit-play/${params.row.id}`)}
            titleAccess="Edit"
          />
          {/* <DeleteIcon
            cursor={"pointer"}
            style={{ color: "red" }}
            onClick={(e) => confirmBeforeDelete(e, params.row)}
            titleAccess="Delete"
          /> */}
        </>
      ),
    },
  ];


  //handle get confirmation before delete user


  const deleteSingleUser = (e, params) => {
    const groupId = params.id;
    httpClient
      .delete(`/admin/delete-group/${groupId}`)
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
      .get(`admin/how-to-play/get-how-to-play`)
      .then((res) => {
        setUserCount(res.data.data.length); // Count based on the response data length
        setLoading(false);
        setRows(
          res.data.data.map((user, index) => {
            console.log("data => ", user);
            return {
              id: user._id,
              col1:
                paginationModel.page * paginationModel.pageSize + (index + 1),
              col2: user.title || "N/A",
              col3: user.thumbnail_url || "N/A",
              col4: user.video_url || "N/A",
              col5: user.video_url_app || "N/A",
              col6: user.createdAt ? user.createdAt.substring(0, 10) : "N/A",
              col7: user.updatedAt ? user.updatedAt.substring(0, 10) : "N/A",
              col8: user.username || "N/A",
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

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="PlayVideo" />

        <CContainer>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="">How To Play Video : </h4>
            {/* <Button
              variant="contained"
              className="my-2"
              sx={{
                backgroundColor: "orange",
              }}
              onClick={() => {
                window.location.href = "how_to_play/add-play";
              }}
            >
              Add Play
            </Button> */}
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
            <div className="">
              {/* <ArrowBackIcon className="pointer-cursor"
            style={{
              // fontSize: "20px",
              marginLeft: "10px",
              cursor: "pointer",
              color: "#333",
            }}
            /> */}
              {/* <button
                className="border-0 border p-2"
                style={{
                  backgroundColor: "gold",
                  borderRadius: "5px",
                }}
                // onClick={() => {}}
              >
                Add Group
              </button> */}
            </div>
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
            ></div>
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
                  // backgroundColor: "gold",
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

export default React.memo(PlayVideo);
