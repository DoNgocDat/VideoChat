// services.js
import axios from 'axios';
import { data } from 'framer-motion/client';

// Thiết lập base URL cho API
const API_URL = 'http://127.0.0.1:5000';

// Hàm để lấy thông tin người dùng theo ID
export const getUserInfo = async () => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('access_token');
        console.log('Access token retrieved:', token); // Debug: Check if token is available

        // Check if token exists
        if (!token) {
            throw new Error('No access token found');
        }

        // Send a GET request with the token in the Authorization header
        const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('User info retrieved successfully:', response.data); // Debug: Log the retrieved data

        // Return user data from the response
        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error; // Throw the error to be handled by the calling function
    }
};

export const getFullAvatarUrl = (relativePath) => {
    const BASE_URL = 'http://127.0.0.1:5000';
    
    // Kiểm tra xem đường dẫn có hợp lệ không
    if (!relativePath || typeof relativePath !== 'string') {
        return ''; // Trả về chuỗi rỗng nếu không có đường dẫn hợp lệ
    }

    // Kiểm tra xem đường dẫn đã bao gồm BASE_URL hay chưa
    if (relativePath.startsWith('/uploads')) {
        return `${BASE_URL}${relativePath}`; // Tạo URL đầy đủ từ đường dẫn tương đối
    }

    // Nếu không phải đường dẫn ảnh, trả về nguyên giá trị (có thể là URL đầy đủ hoặc khác)
    return relativePath;
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