import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Contact.css";
import httpClient from "../../../util/HttpClient";
import Swal from "sweetalert2"; // For success/error alerts

const apiUrl = "/admin/contacts"; // Replace with your API URL
const mailApiUrl = "/admin/send-mail"; // Replace with your email API URL

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [emailData, setEmailData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await httpClient.get(apiUrl);
      setContacts(response.data?.result?.docs || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const getEmailTemplate = () => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>Hello,</h2>
        <p>${emailData.message}</p>
        <p>Best Regards,<br> Your Company</p>
      </div>
    `;
  };

  const sendEmail = async () => {
    if (!emailData.email || !emailData.subject || !emailData.message) {
      Swal.fire("Warning!", "All fields are required.", "warning");
      return;
    }

    try {
      const response = await axios.post(mailApiUrl, {
        to: emailData.email,
        subject: emailData.subject,
        template: getEmailTemplate(),
      });

      Swal.fire("Success!", response.data.message, "success");
      setEmailData({ email: "", subject: "", message: "" }); // Reset form
    } catch (error) {
      Swal.fire("Error!", "Email sending failed.", "error");
    }
  };

  return (
    <div className="contact-manager">
      <h1>Support Manager</h1>

      <div className="email-form">
        <h2>Send Email</h2>
        <label>Email:</label>
        <select
          value={emailData.email}
          onChange={(e) =>
            setEmailData({ ...emailData, email: e.target.value })
          }
        >
          <option value="">Select Contact</option>
          {contacts.map((contact, index) => (
            <option key={index} value={contact.email}>
              {contact.email}
            </option>
          ))}
        </select>

        <label>Subject:</label>
        <input
          type="text"
          placeholder="Enter subject"
          value={emailData.subject}
          onChange={(e) =>
            setEmailData({ ...emailData, subject: e.target.value })
          }
        />

        <label>Message:</label>
        <textarea
          placeholder="Enter message"
          value={emailData.message}
          onChange={(e) =>
            setEmailData({ ...emailData, message: e.target.value })
          }
        />

        <button onClick={sendEmail}>Send Email</button>
      </div>
    </div>
  );
};

export default Contact;
