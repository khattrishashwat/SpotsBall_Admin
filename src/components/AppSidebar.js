import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from "@coreui/react";
import { AppSidebarNav } from "./AppSidebarNav";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import useNavItems from "./_nav";
import styled from "styled-components";

const SidebarLink = styled("a")(({ theme, active }) => ({
  display: "block",
  padding: theme.spacing(1, 2),
  fontSize: "16px",
  color: active ? theme.palette.common.white : theme.palette.text.primary,
  textDecoration: "none",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: active ? theme.palette.primary.main : "transparent",
  transition: "background-color 0.3s, color 0.3s",
  "&:hover": {
    backgroundColor: "red",
    color: "green !important",
  },
}));

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const navItems = useNavItems();

  return (
    <CSidebar
      position="fixed"
      style={{ marginRight: "22vw" }}
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: "set", sidebarShow: visible });
      }}
    >
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navItems} />
        </SimpleBar>
      </CSidebarNav>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() =>
          dispatch({ type: "set", sidebarUnfoldable: !unfoldable })
        }
      /> */}
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
