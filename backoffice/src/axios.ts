import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && token !== "" && config && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      config.validateStatus = function (status) {
        return status >= 200 && status < 500
      }
    }

    return config;
  },
  (error) => {
    console.error("axios interceptors error : ", error);
    return error;
  },
);

export default request;
