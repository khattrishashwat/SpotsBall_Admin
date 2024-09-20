// import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
  const token = window.localStorage.getItem("token");

  if (token) return <Outlet />;
  return <Navigate to={"/auth/login"} />;
};

export default Protected;
