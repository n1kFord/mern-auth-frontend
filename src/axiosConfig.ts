import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_LINK || "http://localhost:8080/api",
    withCredentials: true,
});

export default axiosInstance;
