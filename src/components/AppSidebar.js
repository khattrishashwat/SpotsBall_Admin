import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
// import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// import { logoNegative } from 'src/assets/brand/logo-negative'
// import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from './_nav'
import styled from 'styled-components'

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
    backgroundColor: "red",//theme.palette.action.hover,
    color: "green !important",
  },
}));


const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
     style={{
      // backgroundColor: "red"
     }}
    >
      {/* <CSidebarBrand className="d-none d-md-flex" to="/"> */}
        {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
      {/* </CSidebarBrand> */}
      <CSidebarNav>
        <SimpleBar>
          
          <AppSidebarNav  items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
      
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
