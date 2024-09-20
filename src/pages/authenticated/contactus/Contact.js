import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Contact.css";
import httpClient from "../../../util/HttpClient";

const apiUrl = "/admin/contacts"; // Replace with your API URL

const Contact = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await httpClient.get(apiUrl);
      console.log(response);
      setContacts(response.data?.result?.docs);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="contact-manager">
      <h1>Contact Manager</h1>
      {contacts.map((contact, index) => (
        <div key={index+1} className="contact-item">
          <div className="contact-view">
            <h2>{contact.contactFor}</h2>
            <p>{contact.message}</p>
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Contact;
