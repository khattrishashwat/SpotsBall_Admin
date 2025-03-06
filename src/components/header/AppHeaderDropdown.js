import React from "react";
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import avatar8 from "./../../assets/images/avatars/no_avatar.png";
import { useNavigate } from "react-router-dom";

const AppHeaderDropdown = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    console.log("Logging out...");
    localStorage.clear(); 
    navigate("/auth/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          Account
        </CDropdownHeader>
        <CDropdownDivider />
        <button className="dropdown-item" onClick={handleProfile}>
          <i className="bi bi-person text-primary"></i>&nbsp;Profile
        </button>
        <button className="dropdown-item" onClick={handleLogOut}>
          <i className="bi bi-box-arrow-right text-danger"></i>&nbsp;Log out
        </button>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
