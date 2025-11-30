import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api", // Đổi thành URL backend thực tế của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Tự động gắn Token vào mỗi request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý phản hồi (Response)
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp để đỡ phải gọi .data nhiều lần
    return response.data;
  },
  (error) => {
    // Xử lý lỗi chung (VD: 401 Unauthorized thì đá về login)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;