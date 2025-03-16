import axios from "axios";
import api from "./api";

// const apiClient = axios.create({
//     baseURL: "https://maternitycare.azurewebsites.net/api",
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// apiClient.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

const handleRequest = async (apiCall) => {
    
    try {
        console.log("apiCall",apiCall);
        const response = await apiCall;
        console.log("response",response);
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error.response?.data || error.message;
    }
};

// 🟢 Lấy danh sách tất cả user
export const getAllUserAPI = () => handleRequest(api.get("/users"));


export const getCurrentUserAPI = () => handleRequest(api.get("/users/current"));

// 🔍 Lấy thông tin user theo ID
export const getUserByIdAPI = (id) => handleRequest(api.get(`/users/${id}`));


// 📝 Cập nhật thông tin user
export const updateUserAPI = (id, data) => handleRequest(api.put(`/users/${id}`, data));

// ✅ Kích hoạt user
export const activeUserAPI = (id,data) => handleRequest(api.put(`/users/${id}/activation`, data));

// 🔑 Đổi mật khẩu user
export const changePasswordByUserIdAPI = (id, data) => handleRequest(api.put(`/users/${id}/password`, data));

