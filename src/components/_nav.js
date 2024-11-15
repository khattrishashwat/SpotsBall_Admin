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
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Logo from "./logo.png";

const _nav = [
  {
    component: CNavItem,
    to: "/dashboard",
    icon: (
      <img
        src={Logo}
        width={"45%"}
        style={{
          width: "100%",
          height: "50%",
          // borderRadius: "50%",
          // objectFit: "cover",
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
    name: "Banner Management",
    to: "/banner",
    icon: <Diversity1Icon />,
  },
  {
    component: CNavItem,
    name: "Contest Management",
    to: "/contest_management",
    icon: <EmojiEventsIcon />,
  },
  {
    component: CNavItem,
    name: "Content Pages",
    to: "/content",
    icon: <SourceIcon />,
  },
  {
    component: CNavItem,
    name: "FAQ",
    to: "/faqs",
    icon: <QuizIcon />,
  },
  {
    component: CNavItem,
    name: "How-To-Play",
    to: "/how_to_play",
    icon: <SubscriptionsIcon />,
  },
  {
    component: CNavItem,
    name: "In Press",
    to: "/In_Press",
    icon: <FeedbackIcon />,
  },
  {
    component: CNavItem,
    name: "Payments",
    to: "/payment",
    icon: <MonetizationOnIcon />,
  },
  {
    component: CNavItem,
    name: "Promo Codes",
    to: "/promo_codes",
    icon: <LocalOfferIcon />,
  },
  {
    component: CNavItem,
    name: "Contest Win Circle",
    to: "/winners_circle",
    icon: <EmojiEventsIcon />,
  },
  {
    component: CNavItem,
    name: "Winner",
    to: "/winner",
    icon: <EmojiEventsIcon />,
  },
  {
    component: CNavItem,
    name: "Contact Us",
    to: "/contacts",
    icon: <ContactMailIcon />,
  },
];

export default _nav;
