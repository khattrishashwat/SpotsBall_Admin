import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Mail as MailIcon,
  Drafts as DraftsIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Reply as ReplyIcon,
  ForwardToInbox as ForwardIcon,
  ReplyAll as ReplyAllIcon,
} from "@mui/icons-material";

import AppSidebar from "../../../components/AppSidebar";
import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../common/PageTitle";
import { useTranslation } from "react-i18next";
import Compose from "./Compose";

const messages = [
  {
    id: 1,
    sender: "David Moore",
    subject: "Hi Emily, Please be informed...",
    starred: true,
  },
  {
    id: 2,
    sender: "Microsoft Account",
    subject: "Change the password for your account.",
    starred: false,
  },
  {
    id: 3,
    sender: "Sophia Lara",
    subject: "Hello, last date for registration...",
    starred: false,
  },
  {
    id: 4,
    sender: "Robert Finch",
    subject: "Meeting postponed to next week.",
    starred: false,
  },
];

const messageDetail = {
  subject: "Weekly Update - Week 19 (May 8, 2017 – May 14, 2017)",
  sender: "Sarah Graves",
  email: "itsmesarah268@gmail.com",
  content: `Hi Emily,

This week has been a great week and the team is right on schedule with the set deadline. The team has made great progress and achievements this week.

Regards,
Sarah Graves`,
};

export default function MailPage() {
  const [selectedMsg, setSelectedMsg] = useState(messageDetail);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppSidebar />
      <div className="wrapper bg-light min-vh-100 d-flex-column align-items-center">
        <AppHeader />
        <PageTitle title={t("Email Management")} />
        <Box>
          <Grid container spacing={1} sx={{ mt: 1, px: 2 }}>
            <Grid item xs={12} md={2}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mb: 2 }}
                  onClick={() => setOpen(true)}
                >
                  Compose
                </Button>
                <List>
                  <ListItem button>
                    <ListItemIcon>
                      <MailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sent" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Draft" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Trash" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6">Messages</Typography>
                <Divider sx={{ mb: 1 }} />
                <List>
                  {messages.map((msg) => (
                    <ListItem
                      key={msg.id}
                      button
                      onClick={() =>
                        setSelectedMsg({
                          subject: msg.subject,
                          sender: msg.sender,
                          email: `${msg.sender
                            .split(" ")
                            .join(".")
                            .toLowerCase()}@mail.com`,
                          content: `Hi Emily,\n\nThis is a sample message from ${msg.sender}. This is just placeholder content.\n\nRegards,\n${msg.sender}`,
                        })
                      }
                    >
                      <ListItemIcon>
                        {msg.starred ? (
                          <StarIcon color="warning" />
                        ) : (
                          <MailIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={msg.sender}
                        secondary={msg.subject}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {selectedMsg.subject}
                </Typography>
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>{selectedMsg.sender[0]}</Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {selectedMsg.sender}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedMsg.email}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {selectedMsg.content}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button startIcon={<ReplyIcon />} variant="outlined">
                    Reply
                  </Button>
                  <Button startIcon={<ReplyAllIcon />} variant="outlined">
                    Reply All
                  </Button>
                  <Button startIcon={<ForwardIcon />} variant="outlined">
                    Forward
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    variant="outlined"
                    color="error"
                  >
                    Delete
                  </Button>
                </Box>
              </Paper>
            </Grid>
            <Compose open={open} onClose={() => setOpen(false)} />
          </Grid>
        </Box>

        {/* 👈 Compose Drawer outside the main Box so it overlays on top */}
      </div>
    </>
  );
}
