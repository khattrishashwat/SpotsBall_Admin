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
import { Link, useNavigate } from "react-router-dom";
import httpClient from "../../util/HttpClient";

const AppHeaderDropdown = () => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    console.log("logout")
    localStorage.removeItem("token"); //remove token from local storage
    navigate("/auth/login");
    // httpClient
    //   .get("/logout")
    //   .then((res) => {
    //     if (res.data.success) {
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
        {/* <Link className="dropdown-item" to={"/web/profile"}>
          {" "}
          <i className="bi bi-person-square"></i>&nbsp;Profile
        </Link> */}
        {/* <Link className="dropdown-item" to={"/web/settings"}>
          {" "}
          <i className="bi bi-gear-fill"></i>&nbsp;Settings
        </Link> */}

        <CDropdownDivider />
        <Link className="dropdown-item" onClick={handleLogOut}>
          {" "}
          <i className="bi bi-box-arrow-right text-danger"></i>&nbsp;Log out
        </Link>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
