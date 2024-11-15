// services.js
import axios from "axios";

export const updateUserProfile = async (userData, accessToken) => {
  try {
    const response = await axios.put(
      "http://127.0.0.1:5000/auth/update-profile",
      {
        fullName: userData.name,
        email: userData.email,
        NgaySinh: userData.birthDate,
        GioiTinh: userData.gender,
        DiaChi: userData.address,
        SoDienThoai: userData.phone,
        AnhDaiDien: "",  // Nếu bạn có hình ảnh đại diện, xử lý ở đây
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;  // Giả sử API trả về dữ liệu người dùng đã được cập nhật
  } catch (error) {
    throw new Error("Cập nhật hồ sơ không thành công: " + error.message);
  }
};
