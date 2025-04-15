import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://webmobrildemo.com/spotsball/api/v1/", // staging server
  // baseURL: "https://www.spotsball.wcom/spotsball/api/v1/", // Live server
});

// Request interceptor
httpClient.interceptors.request.use(
  (request) => {
    // Get token from local storage
    let token = window.localStorage.getItem("token");

    // Set Authorization header if token exists
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
      // console.log("token => ", `Bearer ${token}`);
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem("token");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default httpClient;
