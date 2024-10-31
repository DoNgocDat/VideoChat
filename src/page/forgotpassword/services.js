import axios from 'axios';

const apiUrl = 'http://127.0.0.1:5000'; // Địa chỉ API mặc định

// Hàm gửi yêu cầu quên mật khẩu
export const forgotPassword = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}/auth/forgot-password`, data);
        return response.data; // Trả về dữ liệu phản hồi từ API
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        throw error; // Ném lỗi để xử lý ở component
    }
};

// Nếu bạn có thêm các hàm API khác, có thể định nghĩa chúng ở đây
