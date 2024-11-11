import axios from 'axios';

const apiUrl = 'http://127.0.0.1:5000';  // Địa chỉ API của bạn

// Hàm gửi yêu cầu quên mật khẩu
export const forgotPassword = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}/auth/forgot-password`, data);
        if (response.data && response.data.message) {
            console.log(response.data.message);  // Hiển thị thông báo từ API
            return response.data;  // Trả về phản hồi, kiểm tra nếu có message
        } else {
            console.log("Không nhận được mã OTP.");
            return response.data;
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        throw error;  // Ném lỗi nếu gặp sự cố
    }
};
