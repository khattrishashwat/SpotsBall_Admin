import React, { useState } from "react";
import Swal from "sweetalert2";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import httpClient from "../../../util/HttpClient";
import "./e.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
const Compose = ({ open, onClose }) => {
  const [emailData, setEmailData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const mailApiUrl = "admin/mail/send-mail";

  const getEmailTemplate = (name, message, subject) => {
    return `
      <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table style="width: 100%; max-width: 800px; margin: auto; background-color: #ffffff; border-collapse: collapse; border: 1px solid #ddd;">
          <tbody>
            <tr>
              <td colspan="3" style="padding: 25px; text-align: center; background: #0B1874">
                <img src="https://webmobrilmedia.com/spotsball/images/logo.png" style="width: 300px; padding: 10px;">
              </td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 20px;">
                <h2 style="text-align: right; font-size: 22px; font-weight: 800;">
                  Hi ${name || "User"}
                </h2>
              </td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 20px; color: #666; text-align: center;">
                <p style="width: 81%; margin: 0 auto;">${message}</p>
              </td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 20px; text-align: center; font-size: 18px; font-weight: 600;">
                <p style="width: 84%; margin: 0 auto; color: black;">${subject}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };

  const sendEmail = async () => {
    try {
      if (!emailData.email || !emailData.subject || !emailData.message) {
        Swal.fire("Warning!", "All fields are required.", "warning");
        return;
      }

      const emailTemplate = getEmailTemplate(
        emailData.email,
        emailData.message,
        emailData.subject
      );

      const response = await httpClient.post(mailApiUrl, {
        email: emailData.email,
        subject: emailData.subject,
        body: emailTemplate,
      });

      Swal.fire("Success!", response.data.message, "success");
      setEmailData({ email: "", subject: "", message: "" });
      onClose(); // close after send
    } catch (error) {
      Swal.fire("Error!", "Email sending failed.", "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          position: "fixed",
          bottom: 0,
          m: 0,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          height: "80vh", // you can adjust this
          maxHeight: "80vh",
        },
      }}
    >
      <div
        className="email-compose-window"
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <div className="header">
          <span>New Message</span>
          <div className="actions">
            <button className="minimize">–</button>
            <button className="close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div
          className="form"
          style={{ flex: 1, overflowY: "auto", padding: "10px 20px" }}
        >
          <input
            type="email"
            className="input-field"
            placeholder="Recipients"
            value={emailData.email}
            onChange={(e) =>
              setEmailData({ ...emailData, email: e.target.value })
            }
          />
          <input
            type="text"
            className="input-field"
            placeholder="Subject"
            value={emailData.subject}
            onChange={(e) =>
              setEmailData({ ...emailData, subject: e.target.value })
            }
          />

          <div className="editor-container">
            <SunEditor
              setOptions={{
                height: 180,
                buttonList: [
                  ["undo", "redo"],
                  ["font", "fontSize", "formatBlock"],
                  ["bold", "italic", "underline", "strike"],
                  ["fontColor", "hiliteColor", "textStyle"],
                  ["align", "list", "table"],
                  ["link", "image", "video"],
                  ["removeFormat"],
                ],
              }}
              setContents={emailData.message}
              onChange={(content) =>
                setEmailData({ ...emailData, message: content })
              }
            />
          </div>
        </div>

        <div
          className="footer"
          style={{ padding: "10px 20px", borderTop: "1px solid #ccc" }}
        >
          <button className="send-btn" onClick={sendEmail}>
            Send
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default Compose;
