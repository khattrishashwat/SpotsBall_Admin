import React from "react";
import { CNavItem } from "@coreui/react";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import QuizIcon from "@mui/icons-material/Quiz";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SourceIcon from "@mui/icons-material/Source";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InfoIcon from "@mui/icons-material/Info"; // For "Who We Are"
import LinkIcon from "@mui/icons-material/Link"; // For "Social Link"
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Logo from "./logo.png";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DiscountIcon from "@mui/icons-material/Discount";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

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
    icon: <PaymentIcon />, // Different icon for "Payments"
  },
  {
    component: CNavItem,
    name: "AllPayments",
    to: "/allpayments",
    icon: <AccountBalanceWalletIcon />, // Different icon for "AllPayments"
  },

  {
    component: CNavItem,
    name: "PromoCodes",
    to: "/promocodes",
    icon: <DiscountIcon />, // Icon for PromoCodes
  },
  {
    component: CNavItem,
    name: "Coupons",
    to: "/coupons",
    icon: <CardGiftcardIcon />, // Icon for Coupons
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
    name: "Who We Are",
    to: "/who_we_are",
    icon: <InfoIcon />,
  },
  {
    component: CNavItem,
    name: "Social Link",
    to: "/social_links",
    icon: <LinkIcon />,
  },
  {
    component: CNavItem,
    name: "Restricted Area",
    to: "/restricted",
    icon: <LockOutlinedIcon />,
  },
  {
    component: CNavItem,
    name: "Contact Us",
    to: "/contacts",
    icon: <ContactMailIcon />,
  },
  {
    component: CNavItem,
    name: "Subscribers",
    to: "/subscribers",
    icon: <PersonAddIcon />,
  },
  {
    component: CNavItem,
    name: "APK Download",
    to: "/applicatiom_management",
    icon: <CloudDownloadIcon />,
  },
];

export default _nav;
