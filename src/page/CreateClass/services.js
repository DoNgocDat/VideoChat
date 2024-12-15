// services.js
import axios from 'axios';

// // Thiết lập base URL cho API
// const API_URL = 'http://127.0.0.1:5000';

// // Hàm để lấy thông tin người dùng theo ID
// export const getUserInfo = async (userId) => {
//     try {
//         const response = await axios.get(`${API_URL}/users/${userId}`);
//         return response.data; // Trả về dữ liệu người dùng
//     } catch (error) {
//         console.error("Error fetching user info:", error);
//         throw error; // Ném lỗi để xử lý ở nơi gọi
//     }
// };

// Set the base URL for the API
const API_URL = 'http://127.0.0.1:5000/auth/profile';

// Function to fetch user information based on access token
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
        const response = await axios.get(API_URL, {
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

