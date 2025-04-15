import React, { useEffect, useState, useCallback } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import SupportHeader from "./SupportHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { MenuItem } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [apiStatus, setApiStatus] = useState({ success: false, error: false });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [update, setUpdate] = useState();
  const { t } = useTranslation();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const navigate = useNavigate();

  const handleSelect = useCallback((e) => {
    httpClient
      .patch(`/admin/users/${e.target.id}`, {
        is_active: e.target.value === "active",
      })
      .then((res) => {
        console.log("update status ==> ", res);
      });
  }, []);

  const columns = [
    { field: "col1", headerName: "#", width: 100 },
    { field: "col2", headerName: t("Client"), width: 150 },
    { field: "col3", headerName: t("Subject"), width: 250 },

    { field: "col4", headerName: t("Email"), width: 200 },
    {
      field: "col5",
      headerName: t("Team"),
      width: 150,
      renderCell: (params) => (
        <TextField
          select
          value={params.row.col5}
          // onChange={(e) => handleTeamChange(e, params.row)}
          variant="standard"
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="technical">Technical</MenuItem>
          <MenuItem value="support">Support</MenuItem>
          <MenuItem value="business">Business</MenuItem>
        </TextField>
      ),
    },
    {
      field: "col6",
      headerName: t("Status"),
      width: 150,
      renderCell: (params) => {
        const status = params.row.status || "Open";
        const getColor = (status) => {
          switch (status) {
            case "Open":
              return "#28a745"; // green
            case "Progress":
              return "#ffc107"; // yellow
            case "Close":
              return "#dc3545"; // red
            default:
              return "#6c757d"; // grey
          }
        };

        return (
          <select
            value={status}
            // onChange={(e) => handleStatusChange(e, params.row)}
            style={{
              padding: "5px 8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              color: "#fff",
              backgroundColor: getColor(status),
              fontWeight: "500",
            }}
          >
            <option value="Open" style={{ color: "#28a745" }}>
              Open
            </option>
            <option value="Progress" style={{ color: "#ffc107" }}>
              Progress
            </option>
            <option value="Close" style={{ color: "#dc3545" }}>
              Close
            </option>
          </select>
        );
      },
    },

    { field: "col7", headerName: t("Created At"), width: 150 },
    {
      field: "col8",
      headerName: t("Action"),
      width: 150,
      renderCell: (params) => (
        <>
          <MailOutlineIcon
            className="me-2"
            cursor="pointer"
            style={{ color: "blue" }}
            onClick={() => handleSendMail(params.row)}
          />
          <DeleteIcon
            cursor="pointer"
            style={{ color: "red" }}
            onClick={() => confirmBeforeDelete(params.row)}
          />
        </>
      ),
    },
  ];

  const handleSendMail = (row) => {
    navigate("contact", { state: { email: row.col4 } });
  };

  const handleView = (row) => {
    setSelectedFeedback(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFeedback(null);
  };

  const confirmBeforeDelete = useCallback((params) => {
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
          deleteSingleUser(params.id);
        }
      });
  }, []);

  const deleteSingleUser = useCallback((userId) => {
    httpClient
      .delete(`admin/contact-us/${userId}`)
      .then((res) => {
        setAlertMessage(res.data.message);
        setApiStatus({ success: true, error: false });
        setSnackbarOpen(true);
        setLoading(false);
        setUpdate(1);
      })
      .catch((error) => {
        setAlertMessage(error.response.data.message);
        setApiStatus({ success: false, error: true });
        setSnackbarOpen(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    httpClient
      .get(
        `admin/contact-us?page=${paginationModel.page + 1}&limit=${
          paginationModel.pageSize
        }`
      )
      .then((res) => {
        const data = res.data.data.data || [];
        setUserCount(res.data.data.total);
        setRows(
          data.map((doc, index) => ({
            id: doc._id,
            col1: paginationModel.page * paginationModel.pageSize + (index + 1),
            col2: `${doc.first_name || "N/A"} ${doc.last_name || ""}`.trim(),
            col3: doc.message || "N/A",
            col4: doc.email || "N/A",
            col5: doc.subject || "N/A",
            col6: doc.status || "N/A",
            col7: doc.createdAt.substring(0, 10),
            col9: doc.phone || "N/A",
          }))
        );
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }, [paginationModel, update]);

  const handleRecordPerPage = useCallback((e) => {
    setLoading(true);
    setPaginationModel((prev) => ({
      ...prev,
      pageSize: e.target.value,
    }));
  }, []);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title={t("supports")} />
        <CContainer>
          <SupportHeader />
          <div
            style={{
              height: "auto",
              minHeight: "600px",
              border: "1px solid gray",
              padding: 15,
              borderRadius: 5,
              backgroundColor: "#f8f9fa",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={1000}
              message={alertMessage}
              ContentProps={{
                sx: apiStatus.success
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "red" },
              }}
              anchorOrigin={{
                horizontal: "right",
                vertical: "bottom",
              }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  sx={{ p: 0.5 }}
                  onClick={() => setSnackbarOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              }
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                marginBottom: "10px",
              }}
            >
              <CCol xs={5} style={{ display: "flex", alignItems: "center" }}>
                {t("Show")}
                <input
                  className="mx-2"
                  type="number"
                  defaultValue="10"
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
                    margin: "0 5px",
                  }}
                  onChange={handleRecordPerPage}
                />
                {t("Records per page")}
              </CCol>
            </div>

            <DataGrid
              sx={{
                "& .MuiDataGrid-row:nth-of-type(2n)": {
                  backgroundColor: "#d5dbd6",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#d5dbd6",
                },
              }}
              rows={rows}
              columns={columns}
              rowCount={userCount}
              paginationMode="server"
              pageSize={paginationModel.pageSize}
              page={paginationModel.page}
              pagination
              paginationModel={paginationModel}
              onPaginationModelChange={(newModel) =>
                setPaginationModel(newModel)
              }
              loading={loading}
              autoHeight
            />
          </div>
        </CContainer>
      </div>

      {selectedFeedback && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{t("Contact Details")}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label={t("User")}
              fullWidth
              variant="outlined"
              value={selectedFeedback.col2}
              InputProps={{ readOnly: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t("Close")}</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ContactUs;
