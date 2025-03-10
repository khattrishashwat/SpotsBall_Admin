import React from "react";
import { CNavItem, CNavGroup } from "@coreui/react";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import QuizIcon from "@mui/icons-material/Quiz";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SourceIcon from "@mui/icons-material/Source";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EmailIcon from "@mui/icons-material/Email";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DiscountIcon from "@mui/icons-material/Discount";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Logo from "./logo.png";
import SettingsIcon from "@mui/icons-material/Settings";

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
          cursor: "pointer",
          background: "transparent",
        }}
        alt="Logo"
      />
    ),
  },
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    component: CNavGroup,
    name: "Admin Management",
    to: "/",
    icon: <AdminPanelSettingsIcon />,
    items: [
      {
        component: CNavItem,
        name: "Admins",
        to: "/admins",
        icon: <SupervisorAccountIcon />,
      },
      {
        component: CNavItem,
        name: "Admins Activities",
        to: "/admins-activities",
        icon: <ManageAccountsIcon />,
      },
    ],
  },
  //!isAdmin && {
  //   component: CNavGroup,
  //   name: "Admin Management",
  //   to: "/",
  //   icon: <AdminPanelSettingsIcon />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Admins",
  //       to: "/admins",
  //       icon: <SupervisorAccountIcon />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Admins Activities",
  //       to: "/admins-activities",
  //       icon: <ManageAccountsIcon />,
  //     },
  //   ],
  // },
  {
    component: CNavGroup,
    name: "User Management",
    to: "/",
    icon: <PeopleIcon />,
    items: [
      {
        component: CNavItem,
        name: "Users",
        to: "/users",
        icon: <PersonAddIcon />,
      },
      // {
      //   component: CNavItem,
      //   name: "Activity",
      //   to: (id) => `/user/activity/${id}`,
      //   icon: <Diversity1Icon />,
      // },
      {
        component: CNavItem,
        name: "Subscriber",
        to: "/subscribers",
        icon: <SubscriptionsIcon />,
      },
      {
        component: CNavItem,
        name: "Send Notification",
        to: "/notification",
        icon: <FeedbackIcon />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Contest Management",
    icon: <SourceIcon />,
    items: [
      {
        component: CNavItem,
        name: "Contest",
        to: "/contest_management",
        icon: <SourceIcon />,
      },
      {
        component: CNavItem,
        name: "Contest Payment",
        to: "/payment",
        icon: <PaymentIcon />,
      },
      {
        component: CNavItem,
        name: "Promo Codes",
        to: "/promocodes",
        icon: <DiscountIcon />, // Icon for PromoCodes
      },
      {
        component: CNavItem,
        name: "Discount Coupons",
        to: "/coupons",
        icon: <CardGiftcardIcon />, // Icon for Coupons
      },
      // {
      //   component: CNavItem,
      //   name: "FAQ",
      //   to: "/reported-content",
      //   icon: <QuizIcon />,
      // },
    ],
  },
  {
    component: CNavGroup,
    name: "Winner Management",
    to: "/winner",
    icon: <EmojiEventsIcon />,
    items: [
      {
        component: CNavItem,
        name: "Winner Announcement",
        to: "/winners_circle",
        icon: <EmojiEventsIcon />,
      },
      {
        component: CNavItem,
        name: "Winner List",
        to: "/winner",
        icon: <EmojiEventsIcon />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Payments",
    icon: <PaymentIcon />,
    items: [
      {
        component: CNavItem,
        name: "All Payments",
        to: "/allpayments",
        icon: <AccountBalanceWalletIcon />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Content Management",
    icon: <SettingsIcon />,
    items: [
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
        name: "Blogs",
        to: "/blogs",
        icon: <FeedbackIcon />,
      },
      {
        component: CNavItem,
        name: "Who We Are",
        to: "/who_we_are",
        icon: <InfoIcon />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: "PlatForm Setting",
    icon: <SettingsIcon />,
    items: [
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
        name: "How To Play",
        to: "/how_to_play",
        icon: <SubscriptionsIcon />,
      },
      {
        component: CNavItem,
        name: "APK Download",
        to: "/applicatiom_management",
        icon: <CloudDownloadIcon />,
      },
    ],
  },
  // !isAdmin && {
  //   component: CNavGroup,
  //   name: "Notifications",
  //   icon: <NotificationsActiveIcon />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: "Send Notification",
  //       to: "/notifications",
  //       icon: <FeedbackIcon />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: "Send Emails",
  //       to: "/emails",
  //       icon: <FeedbackIcon />,
  //     },
  //   ],
  // },
  {
    component: CNavGroup,
    name: "Notifications",
    icon: <NotificationsActiveIcon />,
    items: [
      {
        component: CNavItem,
        name: "Send Notification",
        to: "/notifications",
        icon: <FeedbackIcon />,
      },
      {
        component: CNavItem,
        name: "Send Emails",
        to: "/emails",
        icon: <EmailIcon />,
      },
    ],
  },
  {
    component: CNavItem,
    name: "Support & Help Center",
    to: "/support",
    icon: <ContactMailIcon />,
  },
];

export default _nav;
