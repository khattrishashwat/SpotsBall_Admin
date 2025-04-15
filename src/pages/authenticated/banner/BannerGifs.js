import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import httpClient from "../../../util/HttpClient";
import swal from "sweetalert2";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // Lightbox styles

const BannerGifs = () => {
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
  const [banners, setBanners] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Open Lightbox with Multiple Images
  const openLightbox = (images, index) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Columns for DataGrid
  const columns = [
    { field: "col1", headerName: "#", width: 100 },
    {
      field: "col2",
      headerName: t("Banner Image"),
      width: 350,
      renderCell: (params) => {
        const images = params.row.col2 || []; // Ensure images is an array

        return images.length > 0 ? (
          <div style={{ display: "flex", gap: "5px" }}>
            {images.slice(0, 4).map((image, index) => (
              <img
                key={index}
                width="70px"
                src={image}
                alt={`banner-${index}`}
                style={{ cursor: "pointer", borderRadius: "5px" }}
                onClick={() => openLightbox(images, index)} // Open all images in lightbox
              />
            ))}
          </div>
        ) : (
          "N/A"
        );
      },
    },
    { field: "col3", headerName: t("Created At"), width: 200 },
    { field: "col4", headerName: t("Updated At"), width: 200 },
    {
      field: "col5",
      headerName: t("Action"),
      width: 200,
      renderCell: (params) => (
        <>
          <EditIcon
            style={{ color: "gold", marginRight: "20px", cursor: "pointer" }}
            onClick={() =>
              navigate(`/bannergifs/edit-bannergifs/${params.row.id}`)
            }
          />
        </>
      ),
    },
  ];

  // Fetch Banners from API
  useEffect(() => {
    fetchBanners();
  }, [paginationModel]);

  const fetchBanners = () => {
    setLoading(true);
    httpClient
      .get(`admin/banner-gifs/get-banner-gifs`)
      .then((res) => {
        const bannerData = res.data.data;
        if (Array.isArray(bannerData)) {
          setBanners(bannerData);
          setUserCount(bannerData.length);

          setRows(
            bannerData.map((banner, index) => ({
              id: banner._id,
              col1:
                paginationModel.page * paginationModel.pageSize + (index + 1),
              col2: banner.bannerGifs || [], // Store the entire array of images
              col3: banner.createdAt.substring(0, 10),
              col4: banner.updatedAt.substring(0, 10),
            }))
          );
        } else {
          console.error("Error: banner data is not an array", bannerData);
          setBanners([]);
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

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title={t("Banner")} />

        <CContainer>
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

      {/* Lightbox for Image Magnification and Scrolling */}
      {lightboxOpen && currentImages.length > 0 && (
        <Lightbox
          mainSrc={currentImages[currentImageIndex]}
          nextSrc={
            currentImages.length > 1
              ? currentImages[(currentImageIndex + 1) % currentImages.length]
              : null
          }
          prevSrc={
            currentImages.length > 1
              ? currentImages[
                  (currentImageIndex + currentImages.length - 1) %
                    currentImages.length
                ]
              : null
          }
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setCurrentImageIndex(
              (currentImageIndex + currentImages.length - 1) %
                currentImages.length
            )
          }
          onMoveNextRequest={() =>
            setCurrentImageIndex((currentImageIndex + 1) % currentImages.length)
          }
        />
      )}
    </>
  );
};

export default BannerGifs;
