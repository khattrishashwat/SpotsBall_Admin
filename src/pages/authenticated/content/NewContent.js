import React, { useEffect, useRef, useState } from "react";

import JoditEditor from "jodit-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ClipLoader from "react-spinners/ClipLoader";
import swal from "sweetalert2";
import httpClient from "../../../util/HttpClient";
import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const NewContent = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const params = useParams();
  const [newContent, setNewContent] = useState({});
  const editor = useRef(null);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const newContentData = {
    description: newContent,
    title: title,
    type:type,
  };

  const updateContent = (e) => {
    setLoading(true);
    httpClient
      .post(`admin/static-content/add-static-content`, newContentData)
      .then((res) => {
        setLoading(false);
        swal.fire({
          text: "Updated Successfully!",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        navigate(-1);
      })
      .catch((err) => {
        setLoading(false);
        let msg = err?.response?.data?.message;
        swal.fire({
          text: { msg },
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      });
  };

  const handleCloseButton = () => {
    navigate("/content");
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <Container>
          <div className="main p-5 ">
            <div className="d-flex flex-column mb-4 w-5 ">
              <Button
                variant="contained"
                sx={{
                  mt: 0,
                  ml: 0,
                  mb: 4,
                  width: "90px",
                  backgroundColor: "orange",
                }}
                onClick={() => {
                  navigate(-1);
                }}
              >
                <ArrowBackIcon />
                {t("Back")}
              </Button>
              <span className="w-5">{t("Title :")} </span>
              <input
                className=""
                value={title}
                placeholder="title"
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  outline: "none",
                }}
              />
            </div>
            {t("Description:")}
            <CKEditor
              editor={ClassicEditor}
              data={content}
              // onReady={editor => {
              //     console.log('Editor is ready to use!', editor);
              // }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setNewContent(data);
              }}
              // onBlur={(event, editor) => {
              //     console.log('Blur.', editor);webwebweb
              // }}
              // onFocus={(event, editor) => {
              //     console.log('Focus.', editor); `
              // }}
            />
            <span className="w-5">{t("Types:")} </span>
            <input
              className=""
              value={type}
              placeholder="title"
              onChange={(e) => setType(e.target.value)}
              style={{
                outline: "none",
              }}
            />
            <button onClick={updateContent} className="Submit">
              {t("Submit")}
            </button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default NewContent;

const Container = styled.div`
  /* width: 100%; */
  min-height: 75vh;
  /* height: fit-content; */
  display: flex;
  background: #fff;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0px 5px;
  box-sizing: border-box;

  /* .header {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0;
    padding-left: 20px;
    color: gray;
  } */

  .main {
    width: 100%;
    margin-bottom: 0;
    display: flex;
    justify-self: right;
    align-self: center;
    flex-direction: column;

    .ck-editor__editable {
      min-height: 400px;
      /* border: 1px solid #ccc; */
      background-color: #f9f9f9;
    }

    .ck.ck-editor__editable_inline {
      padding-left: 10px;
      padding-right: 10px;
    }
  }

  .Submit {
    background-color: orange;
    color: white;
    padding: 10px 20px;
    margin: 10px 0;
    border: none;
    cursor: pointer;
    width: 100%;
    opacity: 0.9;
  }
`;
