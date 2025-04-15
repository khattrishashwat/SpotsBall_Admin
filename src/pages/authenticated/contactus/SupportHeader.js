import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

const SupportHeader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#f9fbff",
        p: 3,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          sx={{
            bgcolor: "#4ea8ff",
            boxShadow: "0 0 20px rgba(78, 168, 255, 0.5)",
            width: 48,
            height: 48,
            mr: 2,
          }}
        >
          <HeadsetMicIcon sx={{ color: "#fff" }} />
        </Avatar>

        <Box>
          <Typography
            variant="subtitle2"
            sx={{ color: "#3a3f51", fontWeight: 600 }}
          >
            Welcome to
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            <Box component="span" sx={{ color: "#0d3b66" }}>
              SpotsBall
            </Box>{" "}
            <Box component="span" sx={{ color: "#4ea8ff" }}>
              Support Desk
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* Decorative Shapes */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            bgcolor: "#d9dfe8",
            transform: "rotate(45deg)",
            mr: 1.5,
          }}
        />
        <Box
          sx={{
            width: 16,
            height: 16,
            bgcolor: "#e0e6f0",
            transform: "rotate(45deg)",
            mr: 1.5,
          }}
        />
        <Box
          sx={{
            width: 60,
            height: 3,
            bgcolor: "#e0e6f0",
            transform: "rotate(45deg)",
            mr: 1.5,
          }}
        />
        <Box
          sx={{
            width: 30,
            height: 30,
            border: "4px solid #e0e6f0",
            borderRadius: "50%",
          }}
        />
      </Box>
    </Box>
  );
};

export default SupportHeader;
