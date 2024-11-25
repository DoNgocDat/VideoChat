// services.js
import axios from 'axios';

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

export const createLopHoc = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/class/${userId}`);
        return response.data; // Trả về dữ liệu về lớp học đã tạo
    }
    catch (error) {
        console.error("Error creating class:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};

export const checkClass = async (classCode) => {
    try {
        const response = await axios.get(`${API_URL}/class/check-class/${classCode}`);
        return response.data.exists;
    }
    catch (error) {
        console.error("Error checking class existence:", error)
        throw error;
    }
}
