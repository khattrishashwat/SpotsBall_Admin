import React from 'react';
import { Link } from 'react-router-dom';

const SideNav = () => {
    return (
        <>
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        {/* <div className="sb-sidenav-menu-heading">Core</div> */}
                        <Link to={'/web/users'} className="nav-link">
                            <i className="fas fa-users"></i>&nbsp;Users Management
                        </Link>
                    </div>
                </div>
                {/* <div className="sb-sidenav-footer">
                    <div className="small">Logged in as:</div>
                    Start Bootstrap
                </div> */}
            </nav>
        </>
    );
}

export default SideNav;
