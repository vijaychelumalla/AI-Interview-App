import axios from "axios";

// Determine base URL:
// 1. Explicit env var REACT_APP_BASE_URL (if backend is on a separate host/domain)
// 2. Relative "" (if backend is proxied, tunneled, or served together)
const getBaseURL = () => {
  if (process.env.REACT_APP_BASE_URL) {
    return process.env.REACT_APP_BASE_URL.replace(/\/+$/, "");
  }
  return "";
};

const instance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30s timeout to allow for serverless or cold-start spinup
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;