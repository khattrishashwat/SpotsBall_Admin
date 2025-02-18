import React, { useState } from "react";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import httpClient from "../../../util/HttpClient"; // Ensure this path is correct based on your project structure

const ContactManagement = () => {
  const [emailData, setEmailData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const mailApiUrl = "admin/mail/send-mail"; // Replace with actual API endpoint

  // Function to generate email template
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

  // Function to send email
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
        // template: emailTemplate,
      });

      Swal.fire("Success!", response.data.message, "success");
      setEmailData({ email: "", subject: "", message: "" });
    } catch (error) {
      Swal.fire("Error!", "Email sending failed.", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Contact Management</h2>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          className="form-control"
          value={emailData.email}
          onChange={(e) =>
            setEmailData({ ...emailData, email: e.target.value })
          }
          placeholder="Enter recipient email"
        />
      </div>
      <div className="form-group mt-2">
        <label>Subject:</label>
        <input
          type="text"
          className="form-control"
          value={emailData.subject}
          onChange={(e) =>
            setEmailData({ ...emailData, subject: e.target.value })
          }
          placeholder="Enter subject"
        />
      </div>
      <div className="form-group mt-2">
        <label>Message:</label>
        <CKEditor
          editor={ClassicEditor}
          data={emailData.message}
          onChange={(event, editor) => {
            const data = editor.getData();
            setEmailData({ ...emailData, message: data });
          }}
        />
      </div>
      <button className="btn btn-primary mt-3" onClick={sendEmail}>
        Send Email
      </button>
    </div>
  );
};

export default ContactManagement;
