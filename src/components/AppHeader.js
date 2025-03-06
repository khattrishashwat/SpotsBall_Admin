import React, { useState } from "react";
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

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  const [messageDropdownOpen, setMessageDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

  const toggleDropdown = (type) => {
    if (type === "message") {
      setMessageDropdownOpen(!messageDropdownOpen);
      setNotificationDropdownOpen(false);
    } else if (type === "notification") {
      setNotificationDropdownOpen(!notificationDropdownOpen);
      setMessageDropdownOpen(false);
    }
  };

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
        >
          <i className="bi bi-list"></i>
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/"></CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto"></CHeaderNav>

        {/* Message and Notification Icons with Dropdowns */}
        <CHeaderNav className="d-flex gap-4">
          {/* Message Dropdown with Green Dot */}
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

          {/* Notification Dropdown with Red Dot */}
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
