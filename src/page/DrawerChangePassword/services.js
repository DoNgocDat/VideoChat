// services.js
import axios from "axios";

// URL API
const API_URL = "http://127.0.0.1:5000/auth/change-password";

// Hàm thay đổi mật khẩu
export const changePassword = async (data, accessToken) => {
  try {
    const response = await axios.post(
      API_URL,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Gửi access token trong header
        },
      }
    );
    return response.data; // Trả về dữ liệu từ API nếu thành công
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error("Đổi mật khẩu thất bại.");
  }
};
