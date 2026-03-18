import axios from "axios";
// const API = process.env.REACT_APP_BASE_URL;
export const API = axios.create({
  baseURL: "https://ai-interview-app-jwd9.onrender.com"
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 🔥 read token directly

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;