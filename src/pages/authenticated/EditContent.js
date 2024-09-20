import React, { useEffect, useRef, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
} from "@coreui/react";
import PageTitle from "../common/PageTitle";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import JoditEditor from "jodit-react";
import httpClient from "../../util/HttpClient";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const EditContent = ({ editContent, callback }) => {
  const editor = useRef(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [closeSnakeBar, setCloseSnakeBar] = useState(false);
  const [content, setContent] = useState(editContent.content);

  useEffect(() => {
    
  }, []);
  console.log('edit content')

  const updatePageData = async () => {
    //fetch data from db and update
    const newContent = {
      content: content.substring(3, content.length - 4).trim(),
    };
    httpClient
      .put(`/admin/content?id=${editContent.id}`, newContent)
      .then((res) => {
        if (res.status === 200) {
          setApiError(false);
          setAlertMessage("Update Successful");
          setApiSuccess(true);
          setCloseSnakeBar(true);
          handleBackBtn()
        } 
      })
      .catch((err) => {
        setApiSuccess(false);
        setAlertMessage("Something Went Wrong!");
        setApiError(true);
        setCloseSnakeBar(true);
        console.log(err);
      });
  };

  const handleBackBtn = () => {
    callback(false);
  };

  return (
    <>
      <div className=" bg-light min-vh-100 m-2 d-flex-column align-items-center">
        <PageTitle title="edit page" />
        <CContainer className="">
          <Snackbar
            open={closeSnakeBar}
            autoHideDuration={1000}
            message={alertMessage}
            color="red"
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px 8px",
              marginBottom: "10px",
            }}
          >
            <h5 style={{ margin: "0" }}>Edit Page</h5>
            <button
              style={{
                border: "none",
                backgroundColor: "blue",
                fontSize: "16px",
                color: "#fff",
                borderRadius: "4px",
                padding: "0px 8px",
              }}
              onClick={handleBackBtn}
            >
              <i
                style={{ fontSize: "25px" }}
                className="bi bi-arrow-left-short"
              ></i>
            </button>
          </div>
          <CRow className="justify-content-center">
            <CCol md={12}>
              <CCardGroup>
                <CCard className="">
                  <CCardBody>
                    <h5 style={{ fontWeight: 700 }}>Title</h5>
                    <input
                      type="text"
                      style={{
                        backgroundColor: "#d6d4d4",
                        padding: "5px",
                        width: "100%",
                        outline: "none",
                        border: "none",
                        borderRadius: "4px",
                        marginBottom: "12px",
                        fontWeight: 600,
                      }}
                      disabled
                      value={editContent.title}
                    />
                    <h5 style={{ fontWeight: 700 }}>Page Content</h5>
                    <div
                      style={{
                        minHeight: "250px",
                      }}
                    >
                      <JoditEditor
                        ref={editor}
                        value={content} //value from api
                        // config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                      />
                    </div>
                    <button
                      onClick={updatePageData}
                      style={{
                        border: "none",
                        backgroundColor: "blue",
                        color: "white",
                        cursor: "pointer",
                        float: "right",
                        display: "inline-block",
                        borderRadius: "5px",
                        padding: "2px 10px",
                        fontSize: "18px",
                      }}
                    >
                      Save
                    </button>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  );
};

export default React.memo(EditContent);
