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
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

const WeAre = () => {
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
  const [faqs, setFaqs] = useState("");
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  let navigate = useNavigate();

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
    {
      field: "col2",
      headerName: "Title",
      width: 180,
    },
    {
      field: "col3",
      headerName: "Description",
      width: 200,
    },
    {
      field: "col4",
      headerName: "Images",
      width: 180,
      renderCell: (params) =>
        params.formattedValue !== "N/A" ? (
          <img width="70px" src={params.formattedValue} alt="banner" />
        ) : (
          ""
        ),
    },
    {
      field: "col5",
      headerName: "Created At",
      width: 180,
    },
    {
      field: "col6",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <EditIcon
            style={{ color: "gold", marginRight: "20px", cursor: "pointer" }}
            onClick={() => navigate(`edit_details/${params.row.id}`)}
          />
          <DeleteIcon
            cursor={"pointer"}
            style={{ color: "red" }}
            onClick={(e) => confirmBeforeDelete(e, params.row)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    httpClient
      .get(`api/v1/admin/who-we-are/get-who-we-are`)
      .then((res) => {
        console.log("content => ", res);

        // Set counts and FAQs
        setUserCount(res.data.data.length);
        setFaqs(res.data.data);
        console.log("faqs", res.data.data);

        // Map rows based on the response
        setRows(
          res.data.data.map((doc, index) => {
            return {
              id: doc._id,
              col1:
                paginationModel.page * paginationModel.pageSize + (index + 1),
              col2: doc.subTitle || "N/A", // Handle string values directly
              col3: doc.description || "N/A", // Handle string values directly
              col4: doc.image || "N/A", // Adjusted for single image
              col5: doc.createdAt ? doc.createdAt.substring(0, 10) : "N/A",
            };
          })
        );

        setLoading(false);
        setStatus("");
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, [paginationModel, status]);

  // Handle get confirmation before delete user
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
      .delete(`api/v1/admin/who-we-are/delete-who-we-are/${userId}`)
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

  // Handle records per page change
  const handleRecordPerPage = (e) => {
    setLoading(true);
    paginationModel.pageSize = e.target.value;
    setPaginationModel({ ...paginationModel });
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Who We Are" />
        <CContainer>
          <div className="d-flex justify-content-between pe-">
            <h4 className="p-0">Who We Are </h4>
            <Button
              variant="contained"
              className="my-2"
              sx={{ backgroundColor: "orange" }}
              onClick={() => {
                window.location.href = "who_we_are/add_details";
              }}
            >
              Add
            </Button>
          </div>
          <div
            style={{
              height: "600px",
              border: "1px solid gray",
              padding: 15,
              borderRadius: 5,
            }}
          >
            {loading ? (
              <Loader />
            ) : (
              <DataGrid
                sx={{
                  "& .MuiDataGrid-row:nth-of-type(2n)": {
                    backgroundColor: "#d5dbd6",
                  },
                  "& .MuiDataGrid-columnHeader": { backgroundColor: "#d5dbd6" },
                }}
                rows={rows}
                columns={columns}
                rowCount={userCount}
                pagination
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                autoHeight
              />
            )}
          </div>
          <Snackbar
            open={closeSnakeBar}
            autoHideDuration={3000}
            message={alertMessage}
            ContentProps={{
              sx: apiSuccess
                ? { backgroundColor: "green" }
                : { backgroundColor: "red" },
            }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            onClose={() => setCloseSnakeBar(false)}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={() => setCloseSnakeBar(false)}
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

export default WeAre;
