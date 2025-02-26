import axios from "axios";

// Tạo instance Axios để quản lý API calls
const apiClient = axios.create({
    baseURL: "https://maternitycare.azurewebsites.net/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm token vào headers trước mỗi request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Xử lý lỗi chung cho tất cả API calls
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
export const getAllUserAPI = () => handleRequest(apiClient.get("/users"));


export const getCurrentUserAPI = () => handleRequest(apiClient.get("/users/current"));

// 🔍 Lấy thông tin user theo ID
export const getUserByIdAPI = (id) => handleRequest(apiClient.get(`/users/${id}`));


// 📝 Cập nhật thông tin user
export const updateUserAPI = (id, data) => handleRequest(apiClient.put(`/users/${id}`, data));

// ✅ Kích hoạt user
export const activeUserAPI = (id) => handleRequest(apiClient.put(`/users/${id}/activation`));

// 🔑 Đổi mật khẩu user
export const changePasswordByUserIdAPI = (id, data) => handleRequest(apiClient.put(`/users/${id}/password`, data));

export const getPackagesAPI = () => handleRequest(apiClient.get("/packages")) 

