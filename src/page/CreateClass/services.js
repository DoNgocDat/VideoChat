// services.js
import axios from 'axios';

// Thiết lập base URL cho API
const API_URL = 'http://127.0.0.1:5000/users';

// Hàm để lấy thông tin người dùng theo ID
export const getUserInfo = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`);
        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};
