import axios from "axios";

const httpClient = axios.create({
  // baseURL: "https://webmobrildemo.com/spotsball/admin/", // staging server
  baseURL: "https://webmobrildemo.com/spotsball/", // staging server
});

// Request interceptor
httpClient.interceptors.request.use(
  (request) => {
    // Get token from local storage
    let token = window.localStorage.getItem("token");

    // Set Authorization header if token exists
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
      console.log("token => ", `Bearer ${token}`);
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
    // Do something with the response data
    return response;
  },
  (error) => {
    // Do something with the response error (e.g., error handling, logging)
    return Promise.reject(error);
  }
);

export default httpClient;
