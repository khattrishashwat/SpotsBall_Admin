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

const Banner = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [closeSnackbar, setCloseSnackbar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [banners, setBanners] = useState("");
  const navigate = useNavigate();

  const columns = [
    { field: "col1", headerName: "#", width: 150 },
    { field: "col2", headerName: "Title", width: 305 },
    {
      field: "col3",
      headerName: "Banner Image",
      width: 200,
      renderCell: (params) =>
        params.formattedValue !== "N/A" ? (
          <img width="70px" src={params.formattedValue} alt="banner" />
        ) : (
          ""
        ),
    },
    { field: "col4", headerName: "Created At", width: 180 },
    { field: "col5", headerName: "Updated At", width: 180 },
    {
      field: "col6",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <EditIcon
            style={{ color: "gold", marginRight: "20px", cursor: "pointer" }}
            onClick={() => navigate(`/banner/edit-banner/${params.row.id}`)}
          />
          {/* <DeleteIcon
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => confirmBeforeDelete(params.row)}
          /> */}
        </>
      ),
    },
  ];

  const confirmBeforeDelete = (params) => {
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
          deleteSingleUser(params);
        }
      });
  };

  const deleteSingleUser = (params) => {
    const groupId = params.id;
    httpClient
      .delete(`admin/delete-banner/${groupId}`)
      .then((res) => {
        setAlertMessage(res.data.message);
        setApiSuccess(true);
        setCloseSnackbar(true);
        fetchBanners();
      })
      .catch((error) => {
        setAlertMessage(error.res?.data?.message || "Error occurred");
        setApiSuccess(false);
        setCloseSnackbar(true);
      });
  };

  useEffect(() => {
    fetchBanners();
  }, [paginationModel]);

  const fetchBanners = () => {
    setLoading(true);
    httpClient
      .get(`admin/banner/get-banner`)
      .then((res) => {
        const bannerData = res.data.data;

        // Ensure bannerData is an array before setting it and mapping over it
        if (Array.isArray(bannerData)) {
          setBanners(bannerData);
          console.log("log", bannerData);

          setUserCount(bannerData.length); // Update user count
          setRows(
            bannerData.map((banner, index) => ({
              id: banner._id,
              col1:
                paginationModel.page * paginationModel.pageSize + (index + 1),
              col2: banner.title || "N/A",
              col3: banner.banner_url || "N/A",
              col4: banner.createdAt.substring(0, 10), // format date
              col5: banner.updatedAt.substring(0, 10), // format date
            }))
          );
        } else {
          console.error("Error: banner data is not an array", bannerData);
          setBanners([]); // Set an empty array to avoid further errors
          setUserCount(0);
          setRows([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching banners:", error);
        setLoading(false);
      });
  };

  const handleRecordPerPage = (e) => {
    setPaginationModel({
      ...paginationModel,
      pageSize: Number(e.target.value),
    });
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Banner" />

        <CContainer>
          {/* <div className="d-flex justify-content-between align-items-center">
            <h4>Banner Management:</h4>
            <Button
              variant="contained"
              sx={{ backgroundColor: "orange" }}
              onClick={() => navigate("add-banner")}
            >
              Add Banner
            </Button>
          </div> */}
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
            open={closeSnackbar}
            autoHideDuration={3000}
            message={alertMessage}
            ContentProps={{
              sx: apiSuccess
                ? { backgroundColor: "green" }
                : { backgroundColor: "red" },
            }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            onClose={() => setCloseSnackbar(false)}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={() => setCloseSnackbar(false)}
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

export default React.memo(Banner);
