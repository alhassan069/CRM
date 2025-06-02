import axios from "axios";
import { redirect } from "react-router-dom";
const serverUrl = "http://localhost:5001/api";
const axiosInstance = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(originalRequest.url);
    console.log(originalRequest.url.includes("/auth"));
    if (error.response.status === 403 && !originalRequest._retry && !originalRequest.url.includes("/auth")) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(serverUrl + "/auth/refresh-token", {}, {
          withCredentials: true,
        });
        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        redirect("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;