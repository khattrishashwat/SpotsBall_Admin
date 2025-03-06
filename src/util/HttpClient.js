import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://webmobrildemo.com/spotsball/api/v1/",
  // baseURL: "https://www.spotsball.com/spotsball/api/v1/",
});


httpClient.interceptors.request.use(
  (request) => {
    let token = window.localStorage.getItem("token");

    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
