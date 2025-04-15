import React, { useEffect, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import { CCol, CContainer } from "@coreui/react";
import PageTitle from "../../common/PageTitle";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import httpClient from "../../../util/HttpClient";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const HowItWork = () => {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([]);
  const { t } = useTranslation();
  let navigate = useNavigate();

  const columns = [
    { field: "index", headerName: "#", width: 100 },
    {
      field: "title",
      headerName: t("Title"),
      width: 200,
    },
    {
      field: "description",
      headerName: t("Description"),
      width: 400,
    },
    {
      field: "icon_image",
      headerName: t("Icon"),
      width: 200,
      renderCell: (params) =>
        params.value ? <img width="50px" src={params.value} alt="icon" /> : "",
    },
    {
      field: "Action",
      headerName: t("Action"),
      width: 140,
      renderCell: (params) => (
        <>
          <EditIcon
            style={{ color: "gold", marginRight: "20px", cursor: "pointer" }}
            onClick={console.log("edit icon ", params)}
            // onClick={() => navigate(`edit_details/${params.row.id}`)}
          />
          <DeleteIcon
            cursor={"pointer"}
            style={{ color: "red" }}
            // onClick={(e) => confirmBeforeDelete(e, params.row)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    httpClient
      .get(`admin/how-it-works/get-how-it-works `)
      .then((res) => {
        if (res.data.success) {
          setSteps(res.data.data[0].steps);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title={t("How It Works")} />
        <CContainer>
          <div className="d-flex justify-content-between">
            <h4>{t("How It Works")}</h4>
            {/* <Button
              variant="contained"
              className="my-2"
              sx={{ backgroundColor: "orange" }}
              onClick={() => navigate("add_details")}
            >
              {t("Add Step")}
            </Button> */}
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
                rows={steps.map((step, index) => ({
                  id: step._id,
                  index: step.index,
                  title: step.title,
                  description: step.description,
                  icon_image: step.icon_image,
                }))}
                columns={columns}
                autoHeight
              />
            )}
          </div>
        </CContainer>
      </div>
    </>
  );
};

export default HowItWork;
