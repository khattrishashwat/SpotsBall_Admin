import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";

import { AppHeaderDropdown } from "./header/index";
import "./AppHeader.css"; // Import CSS file
import Eng from "./images/flags/eng.png";
import Hin from "./images/flags/hindi.jpg";
import French from "./images/flags/french.png";
import Germany from "./images/flags/greman.png";

const languageOptions = {
  en: { name: "English", flag: Eng },
  hi: { name: "हिन्दी", flag: Hin },
};

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const [messageDropdownOpen, setMessageDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    languageOptions[localStorage.getItem("language")] || languageOptions.en
  );
  const toggleDropdown = (type) => {
    if (type === "message") {
      setMessageDropdownOpen(!messageDropdownOpen);
      setNotificationDropdownOpen(false);
      setLanguageDropdownOpen(false);
    } else if (type === "notification") {
      setNotificationDropdownOpen(!notificationDropdownOpen);
      setMessageDropdownOpen(false);
      setLanguageDropdownOpen(false);
    } else if (type === "language") {
      setLanguageDropdownOpen(!languageDropdownOpen);
      setMessageDropdownOpen(false);
      setNotificationDropdownOpen(false);
    }
  };
  useEffect(() => {
    i18n.changeLanguage(localStorage.getItem("language") || "en");
  }, []);

  const changeLanguage = (langKey) => {
    localStorage.setItem("language", langKey);
    setSelectedLanguage(languageOptions[langKey]);
    i18n.changeLanguage(langKey);
  };

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1 custom-padding"
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
        >
          <i className="bi bi-list"></i>
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/"></CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto"></CHeaderNav>

        <CHeaderNav className="d-flex gap-4">
          <CDropdown
            variant="nav-item"
            visible={languageDropdownOpen}
            onClick={() => toggleDropdown("language")}
          >
            <CDropdownToggle caret={false} className="p-0 icon-wrapper">
              <img
                src={selectedLanguage.flag}
                alt={selectedLanguage.name}
                className="flag-icon"
              />
              <span className="ms-2">{selectedLanguage.name}</span>
            </CDropdownToggle>
            <CDropdownMenu className="p-2">
              {Object.entries(languageOptions).map(([key, { name, flag }]) => (
                <CDropdownItem key={key} onClick={() => changeLanguage(key)}>
                  <img src={flag} alt={name} className="flag-icon me-2" />
                  {name}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>

          <CDropdown
            variant="nav-item"
            visible={messageDropdownOpen}
            onClick={() => toggleDropdown("message")}
            className="ms-4"
          >
            <CDropdownToggle
              caret={false}
              className="p-0 icon-wrapper message-icon"
            >
              <i className="bi bi-envelope fs-5"></i>
            </CDropdownToggle>
            <CDropdownMenu className="p-2">
              <CDropdownItem href="#">📩 New message from John</CDropdownItem>
              <CDropdownItem href="#">
                💬 Alice sent you a message
              </CDropdownItem>
              <CDropdownItem href="#">📝 Team meeting scheduled</CDropdownItem>
              <CDropdownItem href="#" className="text-center text-primary">
                View All Messages
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          <CDropdown
            variant="nav-item"
            visible={notificationDropdownOpen}
            onClick={() => toggleDropdown("notification")}
          >
            <CDropdownToggle
              caret={false}
              className="p-0 icon-wrapper notification-icon"
            >
              <i className="bi bi-bell fs-5"></i>
            </CDropdownToggle>
            <CDropdownMenu className="p-2">
              <CDropdownItem href="#">
                🔔 New comment on your post
              </CDropdownItem>
              <CDropdownItem href="#">
                📅 Meeting tomorrow at 10 AM
              </CDropdownItem>
              <CDropdownItem href="#">
                ✅ Task marked as completed
              </CDropdownItem>
              <CDropdownItem href="#" className="text-center text-primary">
                View All Notifications
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>

        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
    </CHeader>
  );
};

export default AppHeader;
