// services.js
import axios from 'axios';
import { data } from 'framer-motion/client';

// Thiết lập base URL cho API
const API_URL = 'http://127.0.0.1:5000';

// Hàm để lấy thông tin người dùng theo ID
export const getUserInfo = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};

// Hàm gửi yêu cầu tham gia lớp học
export const requestJoinClass = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/class/request-join`, data);
        return response.data;
    } catch (error) {
        console.error('Error requesting to join class:', error);
        throw error;
    }
};

// Hàm phê duyệt yêu cầu tham gia
export const approveJoinRequest = async ({ userId, classCode }) => {
    try {
        const response = await axios.post(`${API_URL}/class/approve-join`, {
            userId,
            classCode,
        });
        return response.data;
    } catch (error) {
        console.error('Error approving join request:', error);
        throw error;
    }
};