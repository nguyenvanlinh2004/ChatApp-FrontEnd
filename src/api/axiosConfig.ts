import axios, { type AxiosResponse } from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // URL backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để gắn token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý response
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response.data as any,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
