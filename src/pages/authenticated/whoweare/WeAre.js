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
      width: 200,
      renderCell: (params) => {
        // Join all subtitle values into a single string for display
        return params.formattedValue ? params.formattedValue.join(", ") : "N/A";
      },
    },
    {
      field: "col3",
      headerName: "Description",
      width: 400,
      renderCell: (params) => {
        // Join all description values into a single string for display
        return params.formattedValue ? params.formattedValue.join(" ") : "N/A";
      },
    },
    {
      field: "col4",
      headerName: "Images",
      width: 400,
      renderCell: (params) => {
        // Display the first image or loop through images
        return params.formattedValue && params.formattedValue[0] !== "N/A" ? (
          <img width="70px" src={params.formattedValue[0]} alt="banner" />
        ) : (
          "No Image"
        );
      },
    },
    {
      field: "col5",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => params.formattedValue || "N/A",
    },
    {
      field: "col6",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <button
            className="border-0"
            style={{
              color: "blue",
              background: "transparent",
              padding: "5px",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("edit social link ==> ", params.row.id);
              navigate(`edit_links/${params.row.id}`);
            }}
          >
            Edit
          </button>
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
      .get(`admin/get-static-content2/who_we_are`)
      .then((res) => {
        console.log("content => ", res);
        if (res.data.data && Array.isArray(res.data.data)) {
          setUserCount(res.data.data.length);
          setFaqs(res.data.data);
          console.log("faqs", res.data.data);

          setLoading(false);
          setRows(
            res.data.data.map((doc, index) => {
              return {
                id: doc._id,
                col1:
                  paginationModel.page * paginationModel.pageSize + (index + 1),
                col2: doc.subTitle[0] || ["N/A"], // Ensure it’s an array for joining
                col3: doc.description[0] || ["N/A"], // Ensure it’s an array for joining
                col4: doc.images[0] || ["N/A"], // Ensure it’s an array for the images
                col5: doc.createdAt ? doc.createdAt.substring(0, 10) : "N/A",
              };
            })
          );
          setStatus("");
        } else {
          console.error("Invalid data format", res.data.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
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
      .delete(`admin/delete-faq/${userId}`)
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
        <PageTitle title="Socials Links" />
        <CContainer>
          <div className="d-flex justify-content-between pe-">
            <h4 className="p-0">Socials Links : </h4>
            <Button
              variant="contained"
              className="my-2"
              sx={{ backgroundColor: "orange" }}
              onClick={() => {
                window.location.href = "social_links/add_links";
              }}
            >
              Add Links
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
            </div>
            <DataGrid
              sx={{
                "& .MuiDataGrid-row:nth-of-type(2n)": {
                  backgroundColor: "#d5dbd6",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#ddd",
                },
              }}
              rows={rows}
              columns={columns}
              pageSize={paginationModel.pageSize}
              onPageSizeChange={(newPageSize) => {
                setPaginationModel({
                  ...paginationModel,
                  pageSize: newPageSize,
                });
              }}
              paginationMode="server"
              onPageChange={(newPage) => {
                setPaginationModel({ ...paginationModel, page: newPage });
              }}
              rowCount={userCount}
              loading={loading}
              disableSelectionOnClick
            />
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default WeAre;
