import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000",
  withCredentials: true,
});
