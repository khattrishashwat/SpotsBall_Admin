import axios from "axios";

const httpClient = axios.create({
  // baseURL: "http://localhost:7200", // Replace this with your API base URL
  // baseURL: "http://172.16.100.241:7200", // Replace this with your API base URL
  baseURL: "http://3.130.22.169", // staging server
});

// Request interceptor
httpClient.interceptors.request.use(
  (request) => {
    // Do something with the request config (e.g., add headers, authentication token)
    // For example:
    // request.headers['Authorization'] = 'Bearer sfsdfsdf';
    let token = window.localStorage.getItem("token");
    if (token) {
      token = JSON.parse(token);
    }

    request.headers["Authorization"] = `Bearer ${token}`;
    console.log("token => ", `Bearer ${token}`);
    // console.log("request interceptors", token);

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
