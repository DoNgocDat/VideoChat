import axios from 'axios';

const apiUrl = 'http://127.0.0.1:5000'; // Giá trị mặc định

export const register = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}/auth/register`, data);
        return response.data; // Không cần chỉ định kiểu dữ liệu
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        throw error; // Ném lỗi để xử lý ở component
    }
};
