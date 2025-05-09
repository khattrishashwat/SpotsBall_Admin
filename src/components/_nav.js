import React from "react";
import { useTranslation } from "react-i18next";
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
import ImageIcon from "@mui/icons-material/Image";
import GifIcon from "@mui/icons-material/Gif";

const useNavItems = () => {
  const { t } = useTranslation();
  return [
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
      name: t("Dashboard"),
      to: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      component: CNavGroup,
      name: t("Admin Management"),
      to: "/",
      icon: <AdminPanelSettingsIcon />,
      items: [
        {
          component: CNavItem,
          name: t("Admin"),
          to: "/admins",
          icon: <SupervisorAccountIcon />,
        },
        // {
        //   component: CNavItem,
        //   name: t("Admin Activities"),
        //   to: "/admins-activities",
        //   icon: <ManageAccountsIcon />,
        // },
      ],
    },
    //!isAdmin && {
    //   component: CNavGroup,
    //   name: t("Admin Management"),
    //   to: "/",
    //   icon: <AdminPanelSettingsIcon />,
    //   items: [
    //     {
    //       component: CNavItem,
    //       name: t("Admins"),
    //       to: "/admins",
    //       icon: <SupervisorAccountIcon />,
    //     },
    //     {
    //       component: CNavItem,
    //       name: t("Admins Activities"),
    //       to: "/admins-activities",
    //       icon: <ManageAccountsIcon />,
    //     },
    //   ],
    // },
    {
      component: CNavGroup,
      name: t("User Management"),
      to: "/",
      icon: <PeopleIcon />,
      items: [
        {
          component: CNavItem,
          name: t("Users"),
          to: "/users",
          icon: <PersonAddIcon />,
        },
        // {
        //   component: CNavItem,
        //   name: t("Activity"),
        //   to: (id) => `/user/activity/${id}`,
        //   icon: <Diversity1Icon />,
        // },
        {
          component: CNavItem,
          name: t("Subscriber"),
          to: "/subscribers",
          icon: <SubscriptionsIcon />,
        },
      ],
    },
    {
      component: CNavGroup,
      name: t("Contest Management"),
      icon: <SourceIcon />,
      items: [
        {
          component: CNavItem,
          name: t("Contest"),
          to: "/contest_management",
          icon: <SourceIcon />,
        },
        {
          component: CNavItem,
          name: t("Contest Payment"),
          to: "/payment",
          icon: <PaymentIcon />,
        },
        {
          component: CNavItem,
          name: t("Promo Codes"),
          to: "/promocodes",
          icon: <DiscountIcon />, // Icon for PromoCodes
        },
        {
          component: CNavItem,
          name: t("Discount Coupons"),
          to: "/coupons",
          icon: <CardGiftcardIcon />, // Icon for Coupons
        },
        // {
        //   component: CNavItem,
        //   name: t("FAQ"),
        //   to: "/reported-content",
        //   icon: <QuizIcon />,
        // },
      ],
    },
    {
      component: CNavGroup,
      name: t("Winner Management"),
      to: "/winner",
      icon: <EmojiEventsIcon />,
      items: [
        {
          component: CNavItem,
          name: t("Winner Announcement"),
          to: "/winners_circle",
          icon: <EmojiEventsIcon />,
        },
        {
          component: CNavItem,
          name: t("Winner List"),
          to: "/winner",
          icon: <EmojiEventsIcon />,
        },
      ],
    },
    {
      component: CNavGroup,
      name: t("Payments"),
      icon: <PaymentIcon />,
      items: [
        {
          component: CNavItem,
          name: t("All Payments"),
          to: "/allpayments",
          icon: <AccountBalanceWalletIcon />,
        },
      ],
    },
    {
      component: CNavGroup,
      name: t("Banner Management"),
      icon: <PaymentIcon />,
      items: [
        {
          component: CNavItem,
          name: t("Banner"),
          to: "/banner",
          icon: <ImageIcon />,
        },
        {
          component: CNavItem,
          name: t("Banner Gifs"),
          to: "/bannergifs",
          icon: <GifIcon />,
        },
      ],
    },
    {
      component: CNavGroup,
      name: t("Content Management"),
      icon: <SettingsIcon />,
      items: [
        {
          component: CNavItem,
          name: t("Content Pages"),
          to: "/content",
          icon: <SourceIcon />,
        },
        {
          component: CNavItem,
          name: t("FAQ"),
          to: "/faqs",
          icon: <QuizIcon />,
        },
        {
          component: CNavItem,
          name: t("Blogs"),
          to: "/blogs",
          icon: <FeedbackIcon />,
        },
        {
          component: CNavItem,
          name: t("Who We Are"),
          to: "/who_we_are",
          icon: <InfoIcon />,
        },
      ],
    },
    {
      component: CNavGroup,
      name: t("Platform Setting"),
      icon: <SettingsIcon />,
      items: [
        {
          component: CNavItem,
          name: t("Social Link"),
          to: "/social_links",
          icon: <LinkIcon />,
        },
        {
          component: CNavItem,
          name: t("Restricted Area"),
          to: "/restricted",
          icon: <LockOutlinedIcon />,
        },
        {
          component: CNavItem,
          name: t("How To Play"),
          to: "/how_to_play",
          icon: <SubscriptionsIcon />,
        },
        {
          component: CNavItem,
          name: t("How it Work"),
          to: "/how_it_work",
          icon: <SubscriptionsIcon />,
        },
        {
          component: CNavItem,
          name: t("APK Download"),
          to: "/applicatiom_management",
          icon: <CloudDownloadIcon />,
        },
      ],
    },
    // !isAdmin && {
    //   component: CNavGroup,
    //   name: t("Notifications"),
    //   icon: <NotificationsActiveIcon />,
    //   items: [
    //     {
    //       component: CNavItem,
    //       name: t("Send Notification"),
    //       to: "/notifications",
    //       icon: <FeedbackIcon />,
    //     },
    //     {
    //       component: CNavItem,
    //       name: t("Send Emails"),
    //       to: "/emails",
    //       icon: <FeedbackIcon />,
    //     },
    //   ],
    // },
    {
      component: CNavGroup,
      name: t("Notifications"),
      icon: <NotificationsActiveIcon />,
      items: [
        {
          component: CNavItem,
          name: t("Send Notification"),
          to: "/notification",
          icon: <FeedbackIcon />,
        },
        {
          component: CNavItem,
          name: t("Send Emails"),
          to: "/emails",
          icon: <EmailIcon />,
        },
      ],
    },
    {
      component: CNavItem,
      name: t("Support & Help Center"),
      to: "/support",
      icon: <ContactMailIcon />,
    },
  ];
};

export default useNavItems;
