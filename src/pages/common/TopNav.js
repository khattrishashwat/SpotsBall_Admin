// import React, { useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Header = () => {
//     const profilemenuRef = useRef()
//     const navigate = useNavigate()
//     const handleSideBarToggle = () => {
//         let alredy = document.body.classList.contains('sb-sidenav-toggled')
//         if (alredy) {
//             document.body.classList.remove('sb-sidenav-toggled');
//         } else {
//             document.body.classList.add('sb-sidenav-toggled');
//         }
//     }
//     const handleProfileToggle = () => {
//         let alredy = profilemenuRef.current.classList.contains('show')
//         if (alredy) {
//             profilemenuRef.current.classList.remove('show');
//         } else {
//             profilemenuRef.current.classList.add('show');
//         }
//         // console.log(profilemenuRef.current.classList.add('test'));
//     }
//     const handleLogout = () => {
//         console.log('sdfsdf');
//         navigate('/auth/login')
//     }
//     return (
//         <>
//             <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
//                 <a className="navbar-brand ps-3" href="index.html"></a>
//                 <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={handleSideBarToggle}><i className="fas fa-bars"></i></button>
//                 <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
//                     {/* <div className="input-group">
//                         <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
//                         <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
//                     </div> */}
//                 </form>
//                 <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
//                     <li className="nav-item dropdown">
//                         {/* <a className="nav-link dropdown-toggle" href="#" onClick={handleProfileToggle} role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a> */}
//                         <button className="nav-link dropdown-toggle" onClick={handleProfileToggle}><i className="fas fa-user fa-fw"></i></button>
//                         <ul style={{ marginLeft: '-100px' }} ref={profilemenuRef} className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
//                             <li>
//                                 <Link className="dropdown-item" to={'/web/profile'}>Profile</Link>
//                             </li>
//                             {/* <li><a className="dropdown-item" href="#!">Activity Log</a></li> */}
//                             <li><hr className="dropdown-divider" /></li>
//                             <li>
//                                 <button className="dropdown-item" onClick={handleLogout}>Logout</button>
//                             </li>
//                         </ul>
//                     </li>
//                 </ul>
//             </nav>
//         </>
//     );
// }

// export default Header;
