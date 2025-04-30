import { Navigate, Outlet } from "react-router-dom";

const GuestRoutes = () => {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  if (!token || !name) return <Outlet />;
  return <Navigate to={"/dashboard"} />;
};

export default GuestRoutes;
