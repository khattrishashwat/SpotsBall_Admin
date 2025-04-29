import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Visibility, Close as CloseIcon } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import swal from "sweetalert2";
import httpClient from "../../../util/HttpClient";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import { useTranslation } from "react-i18next";

const Winners = () => {
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchWinners();
  }, [paginationModel, selectedYear]);

  const fetchWinners = async () => {
    setLoading(true);
    try {
      const res = await httpClient.get(
        `admin/contest/the-winners-circle/?year=${selectedYear}`
      );
      const { data } = res.data;

      if (Array.isArray(data)) {
        setRows(
          data.map((doc, index) => ({
            id: doc._id,
            col1: paginationModel.page * paginationModel.pageSize + (index + 1),
            col2: doc?.userId?.first_name || "N/A",
            col3: doc?.userId?.phone || "N/A",
            col4: doc?.contestId?._id || "N/A",
            col5: doc?.contestPaymentsId?.amount || "N/A",
            col6: doc.createdAt ? doc.createdAt.substring(0, 10) : "N/A",
            col7: doc?.closestCoordinate
              ? `x: ${doc.closestCoordinate.x}, y: ${doc.closestCoordinate.y}`
              : "N/A",
          }))
        );
        setUserCount(data.count);
      } else {
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching winners:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (row) => {
    setSelectedWinner(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWinner(null);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const columns = [
    { field: "col1", headerName: "#", width: 80 },
    { field: "col2", headerName: t("Name"), width: 150 },
    { field: "col3", headerName: t("Phone"), width: 150 },
    { field: "col4", headerName: t("Contest Id"), width: 180 },
    { field: "col5", headerName: t("Price"), width: 120 },
    { field: "col6", headerName: t("Created At"), width: 150 },
    { field: "col7", headerName: t("Closest Coordinate"), width: 250 },
    {
      field: "col8",
      headerName: t("Action"),
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleView(params.row)} color="primary">
          <Visibility />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title="Winners" />
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            my={2}
            p={2}
            bgcolor="#f5f5f5"
            borderRadius={2}
          >
            <Typography variant="h5" fontWeight="bold">
              Winners List
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" mr={2}>
                Select Year:
              </Typography>
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                size="small"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <MenuItem key={i} value={2024 + i}>
                    {2024 + i}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          <Box
            sx={{
              height: "70vh",
              width: "100%",
              bgcolor: "#ffffff",
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                rowCount={userCount}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick
                autoHeight
                sx={{
                  "& .MuiDataGrid-row:nth-of-type(even)": {
                    backgroundColor: "#f9f9f9",
                  },
                  "& .MuiDataGrid-columnHeader": { backgroundColor: "#e0e0e0" },
                  "& .MuiDataGrid-cell": { borderBottom: "none" },
                }}
              />
            )}
          </Box>
        </Container>
      </div>

      {selectedWinner && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Winner Details</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              value={selectedWinner.col2}
              readOnly
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              variant="outlined"
              value={selectedWinner.col3}
              readOnly
            />
            <TextField
              margin="dense"
              label="Price"
              fullWidth
              variant="outlined"
              value={selectedWinner.col5}
              readOnly
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="primary"
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={closeSnackbar}
        autoHideDuration={3000}
        onClose={() => setCloseSnackbar(false)}
        message={alertMessage}
        ContentProps={{
          sx: apiSuccess
            ? { backgroundColor: "green" }
            : { backgroundColor: "red" },
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        action={
          <IconButton color="inherit" onClick={() => setCloseSnackbar(false)}>
            <CloseIcon />
          </IconButton>
        }
      />
    </>
  );
};

export default React.memo(Winners);
