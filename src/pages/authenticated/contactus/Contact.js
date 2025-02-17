import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Contact.css";
import httpClient from "../../../util/HttpClient";
import Swal from "sweetalert2"; // For success/error alerts
import { useLocation } from "react-router-dom"; // Import useLocation
import { TextField, Button, Typography, Container, Box } from "@mui/material";

const apiUrl = "/admin/contacts"; // Replace with your API URL
const mailApiUrl = "/admin/send-mail"; // Replace with your email API URL

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [emailData, setEmailData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  // Get the state from location
  const location = useLocation();
  const { email } = location.state || {}; // Check if location.state exists
  console.log("Email from location:", email); // Log for debugging

  useEffect(() => {
    if (email) {
      setEmailData((prevData) => ({ ...prevData, email: email }));
    }
    fetchContacts();
  }, [email]);

  const fetchContacts = async () => {
    try {
      const response = await httpClient.get(apiUrl);
      setContacts(response.data?.result?.docs || []); // Ensure contacts are set correctly
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const getEmailTemplate = () => {
    return `
      <div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;" class="__web-inspector-hide-shortcut__"> 
  <table style="width: 100%; max-width: 800px; margin: auto; background-color: #ffffff; border-collapse: collapse; border: 1px solid #ddd; box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
    <!-- Header -->
    <tbody>
      <tr>
        <td colspan="3" style="padding: 25px; text-align: center; background: #0B1874">
          <img src="https://webmobrilmedia.com/spotsball/images/logo.png" style="text-align: center; display: block; margin: 0 auto; width: 300px; padding: 10px;">
        </td>
      </tr>

      <!-- Navigation -->
      <tr>
        <td colspan="3" style="padding: 25px; padding-bottom: 15px; width: 100%; text-align: center;">
          <span style="margin: 0; color: #9c9c9c; text-transform: uppercase; font-size: 16px; font-weight: 600; margin-right: 50px;">
            <a href="javascript:void(0)" style="color: #9c9c9c; text-decoration:none;">How to Play</a>
          </span>
          <span style="margin: 0; color: #9c9c9c; text-transform: uppercase; font-size: 16px; font-weight: 600; margin-right: 50px;">
            <a href="javascript:void(0)" style="color: #9c9c9c; text-decoration:none;">Competitions</a>
          </span>
          <span style="margin: 0; color: #9c9c9c; text-transform: uppercase; font-size: 16px; font-weight: 600;">
            <a href="javascript:void(0)" style="color: #9c9c9c; text-decoration:none;">Log in</a>
          </span>
        </td>
      </tr>

      <!-- Welcome Message -->
      <tr>
        <td colspan="3" style="padding: 20px;">
          <h2 style="margin: 0; color: #393939; text-align: right; text-transform: uppercase; font-size: 22px; font-weight: 800;">
            Hi {{name}} <!-- Placeholder for the recipient's name -->
          </h2>
        </td>
      </tr>

      <!-- Message -->
      <tr>
        <td colspan="3" style="padding: 20px; color: #666; line-height: 1.5; text-align: center;">
          <p style="width: 81%; margin: 0 auto; padding-top: 12px;">
            {{message}} <!-- Placeholder for the message content -->
          </p>
        </td>
      </tr>

      <!-- Subject -->
      <tr>
        <td colspan="3" style="padding: 20px; color: #666; line-height: 1.5; text-align: center;">
          <p style="width: 84%; margin: 0 auto; padding-top: 12px; font-size: 18px; font-weight: 600; color: black;">
            {{subject}} <!-- Placeholder for the subject -->
          </p>
        </td>
      </tr>

      <!-- Call to Action -->
      <tr>
        <td colspan="3" style="padding: 20px; text-align: center; padding-top: 30px;">
          <p><a href="javascript:void(0)" style="text-decoration:none; font-size: 16px; color: #ffffff; background: #0B1874; padding: 12px 25px; border-radius: 10px;">PLAY MORE »</a></p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td colspan="3" style="padding: 20px; padding-bottom: 8px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd;">
          <p>86-90 Paul Street, London, England EC2A 4NE</p>
          <p><a href="mailto:support_india@spotsball.com" style="color: #007bff; text-decoration: none;">support_india@spotsball.com</a> | <a href="javascript:void(0)" style="color: #007bff; text-decoration: none;">Manage Email Frequency </a> | <a href="javascript:void(0)" style="color: #007bff; text-decoration: none;">Unsubscribe </a> | <a href="tel:+11 123 456 78 91" style="color: #007bff; text-decoration: none;">+11 123 456 78 91</a></p>
          <p><a href="javascript:void(0)" style="color: #007bff; text-decoration: none;">Terms of Play</a> | <a href="javascript:void(0)" style="color: #007bff; text-decoration: none;">Privacy Policy</a> | <a href="javascript:void(0)" style="color: #007bff; text-decoration: none;">Cookie Policy</a></p>
        </td>
      </tr>

      <!-- App Links -->
      <tr>
        <td colspan="3" style="padding: 15px; padding-top: 0; width: 100%; text-align: center;">
          <a href="javascript:void(0)" style="margin-right: 10px;">
            <img src="https://webmobrilmedia.com/spotsball-invoice/applestore.png" alt="App Store" style="width: 110px;">
          </a>
          <a href="javascript:void(0)">
            <img src="https://webmobrilmedia.com/spotsball-invoice/googlePlay.png" alt="Google Play" style="width: 110px;">
          </a>
        </td>
      </tr>

      <!-- Social Media Links -->
      <tr>
        <td colspan="3" style="padding: 15px; padding-top: 0; width: 100%; text-align: center;">
          <a href="javascript:void(0)" style="margin-right: 10px;">
            <img src="https://webmobrilmedia.com/spotsball-invoice/facebook.png" alt="Facebook">
          </a>
          <a href="javascript:void(0)" style="margin-right: 10px;">
            <img src="https://webmobrilmedia.com/spotsball-invoice/threads.png" alt="Threads">
          </a>
          <a href="javascript:void(0)" style="margin-right: 10px;">
            <img src="https://webmobrilmedia.com/spotsball-invoice/youtube.png" alt="YouTube">
          </a>
          <a href="javascript:void(0)" style="margin-right: 10px;">
            <img src="https://webmobrilmedia.com/spotsball-invoice/instagram.png" alt="Instagram">
          </a>
          <a href="javascript:void(0)">
            <img src="twitter.png" alt="Twitter">
          </a>
        </td>
      </tr>
    </tbody>
  </table>
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
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Box className="contact-manager" sx={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Support Manager
        </Typography>

        <Box
          className="email-form"
          sx={{ backgroundColor: "#f5f5f5", p: 3, borderRadius: 2 }}
        >
          <Typography variant="h6" gutterBottom>
            Send Email
          </Typography>
          <label>Email:</label>

          <TextField
            type="email"
            fullWidth
            variant="outlined"
            margin="normal"
            value={emailData.email}
            onChange={(e) =>
              setEmailData({ ...emailData, email: e.target.value })
            }
          />
          <label>Subject:</label>

          <TextField
            type="text"
            fullWidth
            variant="outlined"
            margin="normal"
            value={emailData.subject}
            onChange={(e) =>
              setEmailData({ ...emailData, subject: e.target.value })
            }
          />
          <label>Message:</label>

          <TextField
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            margin="normal"
            value={emailData.message}
            onChange={(e) =>
              setEmailData({ ...emailData, message: e.target.value })
            }
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={sendEmail}
          >
            Send Email
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Contact;
