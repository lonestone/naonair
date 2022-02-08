import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

request.interceptors.request.use(
  (config) => {
    const data = localStorage.getItem("access_token");
    if (data) {
      const token = JSON.parse(data);
      if (token && token !== "" && config && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
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
