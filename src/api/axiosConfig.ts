import axios from "axios";

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
      config.headers.Authorization = token; // có thể dùng Bearer token nếu backend cần
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý response
axiosClient.interceptors.response.use(
  (response) => response.data, // tự động lấy response.data
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login"; // redirect về login
    }
    return Promise.reject(error);
  }
);

export default axiosClient;