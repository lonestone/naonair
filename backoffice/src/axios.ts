import axios from "axios";
import { ARRoutes } from "./router/routes";

const request = axios.create({});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && token !== "" && config && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      config.validateStatus = function (status) {
        return status >= 200 && status < 500;
      };
    }
    return config;
  },
  (error) => {
    if (
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      localStorage.removeItem("access_token");
      document.location.href = ARRoutes.Login;
    }
    console.error("axios interceptors error : ", error);
    return error;
  },
);

export default request;
