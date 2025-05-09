import axios from "axios";
import Swal from "sweetalert2";

// Create Axios instance
const httpClient = axios.create({
  // baseURL: "https://webmobrildemo.com/spotsball/api/v1/", // staging
  baseURL: "https://www.spotsball.com/spotsball/api/v1/", // production
});

// Request Interceptor
httpClient.interceptors.request.use(
  (request) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");

      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "Please log in again.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        window.location.href = "/admin-panel";
      });
    }

    return Promise.reject(error);
  }
);

export default httpClient;
