// services.js
import axios from 'axios';

// Thiết lập base URL cho API
const API_URL = 'http://127.0.0.1:5000';

export const PostRePass = async (email, passwordData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/reset-password/${email}`, passwordData);
        return response.data; // Trả về dữ liệu phản hồi từ API
    } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
};

