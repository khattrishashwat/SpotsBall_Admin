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

const FAQ = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 1, // MUI pagination starts from 0
    pageSize: 5,
  });

  const navigate = useNavigate();

  // Function to fetch FAQs with pagination
  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const res = await httpClient.get(
        `admin/faq/get-all-faq?page=${paginationModel.page}&limit=${paginationModel.pageSize}`
      );
      setUserCount(res.data.data.total);
      setRows(
        res.data.data.data.map((doc, index) => ({
          id: doc._id,
          col1:
            (paginationModel.page-1) * paginationModel.pageSize + (index + 1),
          col2: doc.question || "N/A",
          col3: doc.answer || "N/A",
          col4: doc.createdAt ? doc.createdAt.substring(0, 10) : "N/A",
        }))
      );
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch FAQs on component mount and when paginationModel changes
  useEffect(() => {
    fetchFAQs();
  }, [paginationModel]);

  const handleDelete = (faq) => {
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
          deleteFaq(faq);
        }
      });
  };

  const deleteFaq = async (faq) => {
    setLoading(true);
    try {
      const res = await httpClient.delete(`admin/faq/delete-faq/${faq.id}`);
      setAlertMessage(res.data.message);
      setApiSuccess(true);
      setApiError(false);
      setCloseSnakeBar(true);
      fetchFAQs(); // Refresh data after delete
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Error deleting FAQ");
      setApiError(true);
      setApiSuccess(false);
      setCloseSnakeBar(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPaginationModel({ page: 1, pageSize: newPageSize }); // Reset to page 0 when changing size
  };

  const columns = [
    { field: "col1", headerName: "#", width: 100 },
    { field: "col2", headerName: "Question", width: 400 },
    { field: "col3", headerName: "Answer", width: 500 },
    { field: "col4", headerName: "Created At", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <button
            style={{
              color: "green",
              background: "transparent",
              padding: "5px",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/faqs/update-faq/${params.row.id}`)}
          >
            Edit
          </button>
          <DeleteIcon
            cursor="pointer"
            style={{ color: "red", marginLeft: 10 }}
            onClick={() => handleDelete(params.row)}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="FAQ" />
        <CContainer>
          <div className="d-flex justify-content-between">
            <h4>FAQ :</h4>
            <Button
              variant="contained"
              sx={{ backgroundColor: "orange" }}
              onClick={() => navigate("add-faq")}
            >
              Add FAQ
            </Button>
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
            action={
              <IconButton
                color="inherit"
                onClick={() => setCloseSnakeBar(false)}
              >
                <CloseIcon />
              </IconButton>
            }
          />

          <div
            style={{
              height: "600px",
              border: "1px solid gray",
              padding: 15,
              borderRadius: 5,
            }}
          >
            <CCol xs={5}>
              Show
              <input
                type="number"
                min={1}
                max={100}
                value={paginationModel.pageSize}
                style={{
                  width: "50px",
                  marginLeft: "10px",
                  textAlign: "center",
                  borderRadius: 5,
                  border: "1px solid gray",
                  fontSize: "1rem",
                  fontWeight: 600,
                  height: 25,
                }}
                onChange={(e) =>
                  handlePageSizeChange(parseInt(e.target.value, 10))
                }
              />
              Records per page
            </CCol>

            <DataGrid
              rows={rows}
              columns={columns}
              rowCount={userCount}
              paginationMode="server"
              pageSizeOptions={[5, 10, 20]}
              pageSize={paginationModel.pageSize}
              page={paginationModel.page}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={loading}
              autoHeight
              sx={{
                "& .MuiDataGrid-row:nth-of-type(2n)": {
                  backgroundColor: "#f3f4f6",
                },
                "& .MuiDataGrid-columnHeader": { backgroundColor: "#e5e7eb" },
              }}
            />
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(FAQ);
