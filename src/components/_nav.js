import React from "react";
import { CNavItem } from "@coreui/react";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import QuizIcon from "@mui/icons-material/Quiz";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SourceIcon from "@mui/icons-material/Source";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FilterListIcon from "@mui/icons-material/FilterList";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import ChatIcon from '@mui/icons-material/Chat';
import ReportIcon from "@mui/icons-material/Report";
import Logo from "./logo.png";

const _nav = [
  {
    component: CNavItem,
    name: "Truily Dashboard",
    to: "/dashboard",
    icon: (
      <img
        src={Logo}
        width={"45px"}
        style={{
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          objectFit: "cover",
          cursor: "pointer",
          background: "transparent",
        }}
      />
    ),
  },
  {
    component: CNavItem,
    name: "User Management",
    to: "/users",
    icon: <ManageAccountsIcon />,
  },
  {
    component: CNavItem,
    name: "App Setting",
    to: "/app-setting",
    icon: <AppSettingsAltIcon />,
  },
  {
    component: CNavItem,
    name: "ChatHub",
    to: "/groups",
    icon: <ChatIcon />,
  },
  {
    component: CNavItem,
    name: "Content Pages",
    to: "/content",
    icon: <SourceIcon />,
  },
  {
    component: CNavItem,
    name: "Questions",
    to: "/questions",
    icon: <QuestionAnswerIcon />,
  },
  // {
  //   component: CNavItem,
  //   name: "Preference",
  //   to: "/preference",
  //   icon: <SettingsAccessibilityIcon />,
  // },
  {
    component: CNavItem,
    name: "User Subscription",
    to: "/subscription",
    icon: <FilterListIcon />,
  },
  {
    component: CNavItem,
    name: "FAQ",
    to: "/faqs",
    icon: <QuizIcon />,
  },
  // {
  //   component: CNavItem,
  //   name: "Subscription Category",
  //   to: "/subscription_category",
  //   icon: <SubscriptionsIcon />,
  // },
  {
    component: CNavItem,
    name: "Feedbacks",
    to: "/feedbacks",
    icon: <FeedbackIcon />,
  },
  {
    component: CNavItem,
    name: "Login-Trouble",
    to: "/login-trouble",
    icon: <TroubleshootIcon />,
  },
  // {
  //   component: CNavItem,
  //   name: "Users Subscriptions ",
  //   to: "/users-subscription",
  //   icon: <TroubleshootIcon />,
  // },
  {
    component: CNavItem,
    name: "Reported Users",
    to: "/reported-users",
    icon: <ReportIcon />,
  },
  {
    component: CNavItem,
    name: "Contact Us",
    to: "/contacts",
    icon: <ContactMailIcon />,
  },
];

export default _nav;
