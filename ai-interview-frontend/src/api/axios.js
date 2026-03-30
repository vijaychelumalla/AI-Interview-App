
import axios from "axios";
const API = process.env.REACT_APP_BASE_URL;
const instance = axios.create({
  baseURL: "http://localhost:5000",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 🔥 read token directly

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;