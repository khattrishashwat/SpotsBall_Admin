import React, { useEffect, useState } from "react";
import httpClient from "../../util/HttpClient";
import {
  CAvatar,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Badge, Snackbar } from "@mui/material";
import Loader from "../../components/loader/Loader";
import EditIcon from "@mui/icons-material/Edit";

const avatar = require("../../assets/images/avatars/2.jpg");

const Profile = () => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [openSnakeBar, setOpenSnakeBar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [pointerEvents, setPointerEvents] = useState("");

  const [file, setFile] = useState();
  const [user, setUser] = useState("");

  const initialValues = {
    name: "",
    email: "",
    mobile: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").trim(),
    // email: Yup.string().required("Email is required"),
    mobile: Yup.number().required("Mobile is required"),
  });

  //form submit
  const updateForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setPointerEvents("none");
      setOpacity(0.3);
      setLoading(true);
      values.email = user.email;
      updateNewData(values);
    },
  });

  const updateNewData = (values) => {
    httpClient
      .put("/user/profile/update", { values })
      .then((res) => {
        if (res.data && res.data.success) {
          setLoading(false);
          setAlertMessage(res.data.message);
          setApiSuccess(true);
          setOpenSnakeBar(true);
          setPointerEvents("");
          setOpacity(1);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setLoading(false);
          setApiError(true);
          setAlertMessage(err.response.data.message);
          setOpenSnakeBar(true);
        }
      });
  };

  useEffect(() => {
    httpClient
      .get("/user/profile")
      .then((res) => {
        if (res.data && res.data.user) setUser(res.data.user);
      })
      .catch((err) => {
        if (err.message) {
          setOpacity(0.6);
          setPointerEvents("none");
          setLoading(true);
        }
      });
  }, []);

  //
  const uploadAvatar = (e) => {
    e.preventDefault();

    const formData =  new FormData();
    formData.append('')
    httpClient
      .post("/user/profile/avatar", file)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form onSubmit={uploadAvatar}>
        <input
          type="file"
          filename={file}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default Profile;
